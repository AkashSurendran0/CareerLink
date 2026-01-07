import { RepoDTO } from "../dto/RepoDTO";

export class RepoMapper {
    static toDTO(repo: { id: number | string; description?: string; name?: string; html_url?: string; stargazers_count?: number; watchers_count?: number; forks_count?: number }): RepoDTO {
        return {
            id: String(repo.id),
            description: repo.description ?? "",
            name: repo.name ?? "",
            url: repo.html_url ?? "",
            stars: Number(repo.stargazers_count ?? 0),
            watchers: Number(repo.watchers_count ?? 0),
            forks: Number(repo.forks_count ?? 0)
        };
    }
}