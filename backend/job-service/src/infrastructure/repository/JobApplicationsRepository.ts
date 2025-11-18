import { injectable } from "inversify";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";
import { JobApplicationModel } from "../model/JobApplicationModel";

@injectable()
export class JobApplicationsRepository implements IJobApplicationsRepository {

    async addApplications(user:string, jobId:string, resume:string, coverLetter:string): Promise <{success:boolean}> {
        console.log(user, jobId, resume, coverLetter)
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

}