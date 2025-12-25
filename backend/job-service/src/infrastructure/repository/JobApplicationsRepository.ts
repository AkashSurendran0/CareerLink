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

    async getJobApplicants(id: string, filter:string): Promise<any> {
        const totalCount = await JobApplicationModel.aggregate([
            {$match: {
                jobPost:id
            }},
            {$unwind:'$applicants'},
            {$group:{
                _id:'$applicants.status',
                count:{$sum:1}
            }}
        ])
        let result
        if(filter == 'All'){
            result=await JobApplicationModel.aggregate([
                {$match: {
                    jobPost:id
                }},
                {$unwind:'$applicants'}
            ])
            if(!result) return null
        }else{
            result=await JobApplicationModel.aggregate([
                {$match:{
                    jobPost:id
                }},
                {$unwind:'$applicants'},
                {$match:{
                    'applicants.status':filter
                }}
            ])
            if(!result) return null
        }
        return {result, totalCount}
        
    }

    async acceptApplication(job: string, user: string): Promise<{ success: boolean; }> {
        const result=await JobApplicationModel.updateOne(
            {
                jobPost:job,
                'applicants.user':user
            },
            {$set:{
                'applicants.$.status':'Accepted'
            }}
        )
        return {success: result.modifiedCount == 1}
    }

    async rejectApplication(job: string, user: string): Promise<{ success: boolean; }> {
        const result=await JobApplicationModel.updateOne(
            {
                jobPost:job,
                'applicants.user':user
            },
            {$set:{
                'applicants.$.status':'Rejected'
            }}
        )
        return {success: result.modifiedCount == 1}
    }

    async hireApplication(job: string, user: string): Promise<{ success: boolean; }> {
        const result=await JobApplicationModel.updateOne(
            {
                jobPost:job,
                'applicants.user':user
            },
            {$set:{
                'applicants.$.status':'Hired'
            }}
        )
        return {success: result.modifiedCount == 1}
    }

    async getJobApplicationAnalytics(): Promise<any> {
        const result=await JobApplicationModel.aggregate([
            {
                $unwind:'$applicants'
            },
            {
                $match:{
                    'applicants.createdAt':{
                        $gt:new Date(new Date().getFullYear(), 0, 1),
                        $lt:new Date()
                    }
                }
            },
            {
                $group:{
                    _id: {
                        month:{$month: "$applicants.createdAt"},
                        year:{$year: "$applicants.createdAt"}
                    },
                    count: {$sum:1}
                }
            },
            {
                $project:{
                    _id:0,
                    month:"$_id.month",
                    count:1
                }
            },
            {
                $sort:{month : 1}
            }
        ])
        return result
    }

}