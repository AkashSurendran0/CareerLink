import { JobApplications } from "../enitity/JobApplications"

export interface IJobApplicationsRepository {
    addApplications(user:string, jobId:string, resume:string, coverLetter:string): Promise <{success:boolean}>
    getUserApplications(user:string): Promise<{success:boolean} | {success:boolean, jobs:any[]}>
    getCount(id:string): Promise<number>
    getJobApplicants(id:string): Promise<JobApplications | null>
}