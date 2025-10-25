import { IJobRepository } from "../../domain/repositories/IJobRepository"
import { JobModel } from "../model/JobModel"

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

export class JobRepository implements IJobRepository {

    async addJob(jobDetails: JobDetails, id:string):Promise<{success:boolean}> {
        await JobModel.insertOne({
            company:id,
            jobTitle:jobDetails.jobTitle,
            department:jobDetails.department,
            jobType:jobDetails.jobType,
            location:jobDetails.location,
            jobDescription:jobDetails.jobDescription,
            qualifications:jobDetails.finalQualifications,
            responsibilities:jobDetails.finalResponsibilities,
            benefits:jobDetails.finalBenefits,
            experienceLevel:jobDetails.experienceLevel,
            deadline:jobDetails.applicationDeadline
        })
        return {success:true}
    }

}