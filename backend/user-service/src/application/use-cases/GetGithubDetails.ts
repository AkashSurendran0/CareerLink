import axios from "axios";
import { IGetGithubDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { redisClient } from "../../utils/RedisClient";
import dotenv from 'dotenv'

dotenv.config()

export class GetGithubDetails implements IGetGithubDetails {

    async getGithubDetails(user: string): Promise<any> {
        try {
            let details=await redisClient.get(`detailsFor${user}`);
            if(details) details=JSON.parse(details);
            if(!details){
                const info=await axios.get(`https://api.github.com/users/${user}`);
                details={
                    name:info.data.name,
                    image:info.data.avatar_url,
                    followers:info.data.followers,
                    following:info.data.following,
                    repos:info.data.public_repos
                };
                const repoInfo=await axios.get(`https://api.github.com/users/${user}/repos?per_page=100`);
                const totalStars=repoInfo.data.reduce((acc, repo)=>acc+repo.stargazers_count, 0);
                details.totalStars=totalStars;
                await redisClient.set(`detailsFor${user}`, JSON.stringify(details), 'EX', 3600);
            }
            return {success:true, details};
        } catch (error: any) {
            console.log("Error getting details", error);
            return {success:false};
        }
    }

    async getGithubRepoDetails(user: string): Promise<any> {
        try {
            let heatmap=await redisClient.get(`heatmapFor${user}`);
            if(heatmap) heatmap=JSON.parse(heatmap);
            if(!heatmap){
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
                const res=await axios.post("https://api.github.com/graphql", {query, variables:{username:user}},
                    {
                        headers:{
                            "Content-Type":"application/json",
                            Authorization:`Bearer ${process.env.GITHUB_TOKEN}`
                        }
                    }
                );
                const result=res.data;
                if(result.errors){
                    return {success:false};
                }

                const weeks = result.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
                heatmap = [];
                weeks.forEach((week: any) => {
                    week.contributionDays.forEach((day: any) => {
                        heatmap.push({
                            date: day.date,
                            count: day.contributionCount,
                            color: day.color,
                        });
                    });
                });

                await redisClient.set(`heatmapFor${user}`, JSON.stringify(heatmap), "EX", 3600);

            }
            return {success:true, heatmap};
        } catch (error: any) {
            console.log("Error getting details", error);
            return {success:false};
        }
    }

}