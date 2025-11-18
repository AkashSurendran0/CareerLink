import { ResumeDto } from "../../dto/ResumeDto"

export interface ICreateResume {
    createResume(data:any):Promise<any>
}

export interface IUploadResume {
    uploadResume(url:string, user:string, name:string): Promise<{success:boolean}>
}

export interface IGetAllUserResumes{
    getAllResumes(id:string): Promise<{success:boolean, resume:ResumeDto} | {success:false}>
}

export interface ICreateCoverLetter{
    createCoverLetter(data:any) : Promise<any>
}