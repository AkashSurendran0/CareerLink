import { injectable } from "inversify";
import { IResumeRepository } from "../../domain/repository/IResumeRepository";
import { ResumeModel } from "../models/ResumeModel";

@injectable()
export class ResumeRepository implements IResumeRepository{

    async addResume (url:string, user:string) : Promise<{success:boolean}> {
        await ResumeModel.insertOne(
            {
                user,
                resumes:{
                    url
                }
            }
        )
        return {success:true}
    }

}