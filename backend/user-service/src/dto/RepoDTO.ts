export interface RepoDTO {
    id: string,
    description: string | null
    name: string,
    url: string,
    stars: number,
    watchers: number,
    forks: number
}