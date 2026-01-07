import { injectable } from "inversify";
import { IResumeRepository } from "../../domain/repository/IResumeRepository";
import { ResumeModel } from "../models/ResumeModel";
import { Resume } from "../../domain/entity/Resume";
import { ResumeItem } from "../../domain/entity/Resume";

@injectable()
export class ResumeRepository implements IResumeRepository{

    async addResume (url:string, user:string, name:string) : Promise<{success:boolean}> {
        await ResumeModel.updateOne(
            {user},
            {
                $push:{
                    resumes:{
                        name,
                        url
                    }
                }
            },
            {upsert:true}
        );
        return {success:true};
    }

    async getAllResumes(id: string): Promise<{success:boolean, resumes:Resume} | {success:false}> {
        const doc=await ResumeModel.findOne({user:id}).lean();
        if(!doc) return {success:false};
        const resumeItems=doc.resumes.map(
            r=>new ResumeItem(r.name, r.url, r.createdAt)
        );
        const resume = new Resume (
            doc._id.toString(),
            doc.user,
            resumeItems
        );

        return {success:true, resumes:resume};
    }

}