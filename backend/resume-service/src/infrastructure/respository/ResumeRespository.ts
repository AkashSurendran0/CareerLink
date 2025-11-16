import { injectable } from "inversify";
import { IResumeRepository } from "../../domain/repository/IResumeRepository";
import { ResumeModel } from "../models/ResumeModel";
import { Resume } from "../../domain/entity/Resume";
import { ResumeItem } from "../../domain/entity/Resume";

@injectable()
export class ResumeRepository implements IResumeRepository{

    async addResume (url:string, user:string, name:string) : Promise<{success:boolean}> {
        await ResumeModel.insertOne(
            {
                user,
                resumes:{
                    name,
                    url
                }
            }
        )
        return {success:true}
    }

    async getAllResumes(id: string): Promise<{success:boolean, resumes:Resume} | {success:false}> {
        const doc=await ResumeModel.findOne({user:id})
        if(!doc) return {success:false}
        const resumeItems=doc.resumes.map(
            r=>new ResumeItem(r.name, r.url, r.createdAt)
        )
        const resume = new Resume (
            doc._id,
            doc.user,
            resumeItems
        )

        return {success:true, resumes:resume}
    }

}