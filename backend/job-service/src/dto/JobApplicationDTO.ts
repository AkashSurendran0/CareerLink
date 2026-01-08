export interface JobApplicationDto {
    _id: string,
    jobPost: string,
    applicants: {
        _id: string | undefined,
        user: string,
        resume: string | undefined,
        coverLetter: string | undefined,
        status: string | undefined,
        createdAt: Date | undefined
    }[]
}