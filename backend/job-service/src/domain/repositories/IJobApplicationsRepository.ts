import { JobApplications } from "../enitity/JobApplications";

export interface IJobApplicationsRepository {
    addApplications(user:string, jobId:string, resume:string, coverLetter:string): Promise <{success:boolean}>
    getUserApplications(user:string): Promise<{success:boolean} | {success:boolean, jobs: unknown[]}>
    getCount(id:string): Promise<number>
    getJobApplicants(id:string, filter:string): Promise<{ result: unknown[]; totalCount: unknown[] } | null>
    acceptApplication(job:string, user:string): Promise<{success:boolean}>
    rejectApplication(job:string, user:string): Promise<{success:boolean}>
    getJobApplicationAnalytics(): Promise<Array<{ month:number; count:number }>>
    hireApplication(job:string, user:string): Promise<{success:boolean}>
}