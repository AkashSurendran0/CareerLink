import axios from "axios";
import { IGetGithubDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { redisClient } from "../../utils/RedisClient";
import dotenv from "dotenv";
import { RepoDTO } from "../../dto/RepoDTO";
import { RepoMapper } from "../../mappers/RepoMapper";
import { logger } from "../../utils/logger";

dotenv.config();

interface GithubDetails {
    name: string;
    image: string;
    followers: number;
    following: number;
    repos: number;
    totalStars?: number;
}

interface HeatmapItem {
    date: string;
    count: number;
    color: string;
}

export class GetGithubDetails implements IGetGithubDetails {

    async getGithubDetails(user: string): Promise<{ success: boolean; details?: GithubDetails }> {
        try {
            let details: GithubDetails | null = null;
            const cachedDetails = await redisClient.get(`detailsFor${user}`);
            if (cachedDetails) details = JSON.parse(cachedDetails) as GithubDetails;

            if (!details) {
                const info = await axios.get(`https://api.github.com/users/${user}`);
                details = {
                    name: info.data.name,
                    image: info.data.avatar_url,
                    followers: info.data.followers,
                    following: info.data.following,
                    repos: info.data.public_repos
                };
                const repoInfo = await axios.get(`https://api.github.com/users/${user}/repos?per_page=100`);
                const totalStars = Array.isArray(repoInfo.data)
                    ? repoInfo.data.reduce((acc: number, repo: unknown) => {
                        const stargazers = (repo as { stargazers_count?: number }).stargazers_count;
                        return acc + (typeof stargazers === 'number' ? stargazers : 0);
                    }, 0)
                    : 0;
                details.totalStars = totalStars;
                await redisClient.set(`detailsFor${user}`, JSON.stringify(details), "EX", 3600);
            }
            return { success: true, details };
        } catch (error: unknown) {
            logger.error({ error }, "Error getting details");
            return { success: false };
        }
    }

    async getGithubHeatmap(user: string): Promise<{ success: boolean; heatmap?: HeatmapItem[] }> {
        try {
            let heatmap: HeatmapItem[] | null = null;
            const cachedHeatmap = await redisClient.get(`heatmapFor${user}`);
            if (cachedHeatmap) heatmap = JSON.parse(cachedHeatmap) as HeatmapItem[];

            if (!heatmap) {
                const query = `
                    query($username: String!) {
                    user(login: $username) {
                        contributionsCollection {
                        contributionCalendar {
                            weeks {
                            contributionDays {
                                date
                                contributionCount
                                color
                            }
                            }
                        }
                        }
                    }
                    }
                `;
                const res = await axios.post("https://api.github.com/graphql", { query, variables: { username: user } },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
                        }
                    }
                );
                const result = res.data;
                if (result.errors) {
                    return { success: false };
                }

                const weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number; color: string }> }> = result.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
                heatmap = [];
                weeks.forEach((week) => {
                    week.contributionDays.forEach((day) => {
                        heatmap!.push({
                            date: day.date,
                            count: day.contributionCount,
                            color: day.color,
                        });
                    });
                });

                await redisClient.set(`heatmapFor${user}`, JSON.stringify(heatmap), "EX", 3600);

            }
            return { success: true, heatmap };
        } catch (error: unknown) {
            logger.error({ error }, "Error getting details");
            return { success: false };
        }
    }

    async getGithubRepoDetails(page: number, user: string, limit: number): Promise<{ success: boolean, data?: RepoDTO[] } | { success: boolean }> {
        try {
            let data: RepoDTO[] | null = null;
            const cachedData = await redisClient.get(`reposInPage${page}WithLimit${limit}for${user}`);
            if (cachedData) data = JSON.parse(cachedData) as RepoDTO[];

            if (!data) {
                const skip = page * limit;
                const skipRepo = Math.floor(skip / limit) + 1;
                const result = await axios.get(`https://api.github.com/users/${user}/repos?per_page=${limit}&page=${skipRepo}`);
                data = (result.data as unknown[]).map((repo) => RepoMapper.toDTO(repo as Record<string, unknown>));
                await redisClient.set(`reposInPage${page}WithLimit${limit}for${user}`, JSON.stringify(data), "EX", 3600);
            }
            return { success: true, data };
        } catch (error: unknown) {
            logger.error({ error }, "Error getting details");
            return { success: false };
        }
    }

}