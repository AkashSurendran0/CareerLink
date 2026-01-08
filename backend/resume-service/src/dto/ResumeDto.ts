export interface ResumeDto {
    _id: string,
    user: string,
    resumes: {
        name: string,
        url: string,
        createdAt: Date
    }[]
}