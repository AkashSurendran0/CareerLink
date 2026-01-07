import { Resume } from "../entity/Resume";

export interface IResumeRepository{
    addResume (url:string, user:string, name:string) : Promise<{success:boolean}>
    getAllResumes(id:string): Promise<{success:boolean, resumes:Resume} | {success:false}>
}