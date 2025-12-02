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

export interface ICreateTailoredResume {
    createTailoredResume(job:any, details:any, user:any): Promise<any>
}

export interface ICreateTailoredCoverLetter {
    createTailoredCoverLetter(job:any, details:any, user:any): Promise<any>
}

export interface ICheckTailoredVersion {
    checkTailoredResume(details:any, user:string): Promise<{success:boolean} | {success:boolean, message:string}>
    checkTailoredCoverLetter(details:any, user:string): Promise<{success:boolean} | {success:boolean, message:string}>
}

export interface IDeleteCount {
    deleteCount(id:string): Promise<{success:boolean}>
}

export interface ICheckNormalVersion {
    checkResume(details:any, user:string): Promise<{success:boolean} | {success:boolean, message:string}>
    checkCoverLetter(details:any, user:string): Promise<{success:boolean} | {success:boolean, message:string}>
}