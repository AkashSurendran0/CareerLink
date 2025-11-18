import { JobDTO } from "../../dto/JobDTO"

type JobDetails = {
    jobTitle:string,
    department:string,
    jobType:string,
    location:string,
    jobDescription:string,
    experienceLevel:string,
    applicationDeadline:Date,
    finalQualifications:string[],
    finalResponsibilities:string[],
    finalBenefits:string[] | null[]
}

export interface IAddJob {
    addJob(jobDetails:JobDetails, id:string): Promise<{success:boolean}>
}

export interface IGetAllJobs {
    getAllJobs(id:string, start:number, limit:number, query:string | undefined, filter:string): Promise<{jobs:JobDTO[], limit:number, count:number}>
}

export interface IGetJobDetails {
    getDetails(id:string): Promise<JobDTO>
}

export interface IEditJob {
    editJob(jobDetails: any): Promise<{success:boolean}>
}

export interface ICloseJobApplication {
    closeJob(id:string): Promise<{success:boolean}>
}

export interface IGetAvailableJobs {
    getAvailableJobs(query:string): Promise<JobDTO[]>
}

export interface IApplyJobWithUrl {
    applyJob(data:any, user:string): Promise<{success:boolean}>
}