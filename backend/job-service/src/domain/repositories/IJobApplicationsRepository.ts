export interface IJobApplicationsRepository {
    addApplications(user:string, jobId:string, resume:string, coverLetter:string): Promise <{success:boolean}>
    getUserApplications(user:string): Promise<{success:boolean} | {success:boolean, jobs:any[]}>
}