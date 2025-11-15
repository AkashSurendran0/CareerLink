import { Job } from "../../domain/enitity/Job"
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
            open:true,
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

    async getAllJobs(id: string, filter:string): Promise<Job[]> {
        let jobs
        if(filter=='all'){
            jobs=await JobModel.find({company:id})
        }else if(filter=='open'){
            jobs=await JobModel.find({company:id, open:true})
        }else{
            jobs=await JobModel.find({company:id, open:false})
        }
        return jobs.map((job:any)=>
            new Job(
                job._id,
                job.company,    
                job.open,
                job.jobTitle,
                job.department,
                job.jobType,
                job.location,
                job.jobDescription,
                job.qualifications,
                job.responsibilities,
                job.benefits,
                job.experienceLevel,
                job.deadline,
                job.createdAt
            )
        )
    }

    async findDetails(id: string): Promise<Job> {
        const job=await JobModel.findOne({_id:id})
        return new Job(
            job!._id,
            job!.company,
            job!.open,
            job!.jobTitle,
            job!.department,
            job!.jobType,
            job!.location,
            job!.jobDescription,
            job!.qualifications,
            job!.responsibilities,
            job!.benefits,
            job!.experienceLevel,
            job!.deadline,
            job!.createdAt
        )
    }

    async editJob(jobDetails: any): Promise<{ success: boolean; }> {
        await JobModel.updateOne(
            {_id:jobDetails._id},
            {
                $set:jobDetails
            }
        )
        return {success:true}
    }

    async closeJob(id: string): Promise<{ success: boolean; }> {
        await JobModel.updateOne(
            {_id: id},
            {
                $set: {open:false}
            }
        )
        return {success:true}
    }

    async getAvailableJobs(): Promise<Job[]> {
        const jobs=await JobModel.find()
        return jobs.map(job=>
            new Job (
                job._id,
                job.company,
                job.open,
                job.jobTitle,
                job.department,
                job.jobType,
                job.location,
                job.jobDescription,
                job.qualifications,
                job.responsibilities,
                job.benefits,
                job.experienceLevel,
                job.deadline,
                job.createdAt
            )
        )
    }

    async getQueryJobs(id: string, start: number, limit: number, query: string | undefined, filter:string): Promise<Job[]> {
        let jobs
        console.log(filter)
        if(query){
            if(filter=='all'){
                jobs=await JobModel.aggregate([
                    {$match:{
                        company:`${id}`,
                        jobTitle:{$regex:/^query/i}
                    }},
                    {$skip:(start-1)*limit},
                    {$limit:limit}
                ])
            }else if(filter=='open'){
                jobs=await JobModel.aggregate([
                    {$match:{
                        company:`${id}`,
                        jobTitle:{$regex:/^query/i},
                        open:true
                    }},
                    {$skip:(start-1)*limit},
                    {$limit:limit}
                ])
            }else{
                jobs=await JobModel.aggregate([
                    {$match:{
                        company:`${id}`,
                        jobTitle:{$regex:/^query/i},
                        open:false
                    }},
                    {$skip:(start-1)*limit},
                    {$limit:limit}
                ])
            }
        }else{
            if(filter=='all'){
                jobs=await JobModel.aggregate([
                    {$match:{
                        company:`${id}`,
                    }},
                    {$skip:(start-1)*limit},
                    {$limit:limit}
                ])
            }else if(filter=='open'){
                jobs=await JobModel.aggregate([
                    {$match:{
                        company:`${id}`,
                        open:true
                    }},
                    {$skip:(start-1)*limit},
                    {$limit:limit}
                ])
            }else{
                jobs=await JobModel.aggregate([
                    {$match:{
                        company:`${id}`,
                        open:false
                    }},
                    {$skip:(start-1)*limit},
                    {$limit:limit}
                ])
            }
        }
        return jobs.map(job=>
            new Job (
                job._id,
                job.company,
                job.open,
                job.jobTitle,
                job.department,
                job.jobType,
                job.location,
                job.jobDescription,
                job.qualifications,
                job.responsibilities,
                job.benefits,
                job.experienceLevel,
                job.deadline,
                job.createdAt
            )
        )
    }

}