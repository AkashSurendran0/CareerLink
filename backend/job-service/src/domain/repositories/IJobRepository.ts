import { Job } from "../enitity/Job"

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

export interface IJobRepository {

    addJob(jobDetails: JobDetails, id:string):Promise<{success:boolean}>
    getAllJobs(id:string): Promise<Job[]>
    findDetails(id:string): Promise<Job>
    editJob(jobDetails): Promise<{success:boolean}>

}