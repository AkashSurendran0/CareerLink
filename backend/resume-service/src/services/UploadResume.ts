import { IUploadResume } from "../domain/services/IResumeServices";
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IResumeRepository } from "../domain/repository/IResumeRepository";

@injectable()
export class UploadResume implements IUploadResume {

    constructor(
        @inject(TYPES.IResumeRepository) private _resumeRepository:IResumeRepository
    ){}

    async uploadResume(url: string, user:string): Promise<{ success: boolean; }> {
        const result=await this._resumeRepository.addResume(url, user)
        return result
    }

}