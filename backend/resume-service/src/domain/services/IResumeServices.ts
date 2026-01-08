import { ResumeDto } from "../../dto/ResumeDto";

export interface ICreateResume {
    createResume(data: Record<string, unknown>): Promise<{ success: boolean; pdf: Buffer; html: string; provider: string } | { success: false; message: string }>
}

export interface IUploadResume {
    uploadResume(url: string, user: string, name: string): Promise<{ success: boolean }>
}

export interface IGetAllUserResumes {
    getAllResumes(id: string): Promise<{ success: boolean, resume: ResumeDto } | { success: false }>
}

export interface ICreateCoverLetter {
    createCoverLetter(data: Record<string, unknown>): Promise<{ success: boolean; content: string; provider: string } | { success: false; message: string }>
}

export interface ICreateTailoredResume {
    createTailoredResume(job: Record<string, unknown>, details: Record<string, unknown>, user: Record<string, unknown>): Promise<{ success: boolean; pdf: Buffer; html: string; provider: string } | { success: false; message: string }>
}

export interface ICreateTailoredCoverLetter {
    createTailoredCoverLetter(job: Record<string, unknown>, details: Record<string, unknown>, user: Record<string, unknown>): Promise<{ success: boolean; content: string; provider: string } | { success: false; message: string }>
}

export interface ICheckTailoredVersion {
    checkTailoredResume(details: Record<string, unknown>, user: string): Promise<{ success: boolean } | { success: boolean, message: string }>
    checkTailoredCoverLetter(details: Record<string, unknown>, user: string): Promise<{ success: boolean } | { success: boolean, message: string }>
}

export interface IDeleteCount {
    deleteCount(id: string): Promise<{ success: boolean }>
}

export interface ICheckNormalVersion {
    checkResume(details: Record<string, unknown>, user: string): Promise<{ success: boolean } | { success: boolean, message: string }>
    checkCoverLetter(details: Record<string, unknown>, user: string): Promise<{ success: boolean } | { success: boolean, message: string }>
}