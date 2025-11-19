import { injectable } from "inversify";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";
import { JobApplicationModel } from "../model/JobApplicationModel";
import { Applications } from "../../domain/enitity/JobApplications";
import { JobApplications } from "../../domain/enitity/JobApplications";

@injectable()
export class JobApplicationsRepository implements IJobApplicationsRepository {

    async addApplications(user:string, jobId:string, resume:string, coverLetter:string): Promise <{success:boolean}> {
        await JobApplicationModel.updateOne(
            {jobPost:jobId},
            {
                $push:{
                    applicants:{
                        user, 
                        resume,
                        coverLetter
                    }
                }
            },
            {upsert:true}
        )
        return {success:true}
    }

    async getUserApplications(user: string): Promise<{ success: boolean; } | { success: boolean; jobs: any[]; }> {
        const jobs=await JobApplicationModel.aggregate([
            {$unwind: '$applicants'},
            {$match:{
                'applicants.user':user
            }}
        ])
        if(!jobs) return {success:false}
        return {success:true, jobs}
    }

    async getCount(id: string): Promise<number> {
        const stringId=String(id)
        const docs=await JobApplicationModel.aggregate([
            {$match:
                {jobPost:stringId}
            },
            {$unwind: '$applicants'},
        ])
        return docs.length
    }

    async getJobApplicants(id: string): Promise<JobApplications | null> {
        const result=await JobApplicationModel.findOne({jobPost:id})
        if(!result) return null
        const applications=result?.applicants.map(
            r=>new Applications(r._id, r.user, r.resume, r.coverLetter, r.status, r.createdAt)
        )
        return new JobApplications (
            result?._id,
            result?.jobPost,
            applications
        )
    }

}