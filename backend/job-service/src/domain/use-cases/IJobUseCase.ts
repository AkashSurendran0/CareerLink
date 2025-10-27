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
    getAllJobs(id:string): Promise<JobDTO[]>
}

export interface IGetJobDetails {
    getDetails(id:string): Promise<JobDTO>
}

export interface IEditJob {
    editJob(jobDetails): Promise<{success:boolean}>
}