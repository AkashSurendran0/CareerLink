export interface JobDTO {
    _id: string,
    company: string,
    open: boolean,
    jobTitle: string,
    department: string,
    jobType: string,
    location: string,
    jobDescription: string,
    qualifications: string[],
    responsibilities: string[],
    benefits: string[],
    experienceLevel: string,
    deadline: Date | undefined,
    createdAt: Date | undefined,
    count?: number
}