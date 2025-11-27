import { RepoDTO } from "../dto/RepoDTO";

export class RepoMapper {
    static toDTO(repo:any): RepoDTO {
        return {
            id:repo.id,
            description:repo.description,
            name:repo.name,
            url:repo.html_url,
            stars:repo.stargazers_count,
            watchers:repo.watchers_count,
            forks:repo.forks_count
        }
    }
}