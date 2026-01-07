import { inject, injectable } from "inversify";
import { IGetAllUserResumes } from "../domain/services/IResumeServices";
import { ResumeDto } from "../dto/ResumeDto";
import { TYPES } from "../types";
import { IResumeRepository } from "../domain/repository/IResumeRepository";
import { ResumeMapper } from "../mapper/ResumeMapper";

@injectable()
export class GetAllUserResumes implements IGetAllUserResumes {

    constructor(
        @inject(TYPES.IResumeRepository) private _resumeRepository:IResumeRepository
    ){}

    async getAllResumes(id:string): Promise<{success:boolean, resume:ResumeDto} | {success:false}> {
        const resumeResult=await this._resumeRepository.getAllResumes(id);
        if(!resumeResult.success || !("resumes" in resumeResult)) {
            return {success:false};
        }
        const resume =  ResumeMapper.toDTO(resumeResult.resumes);
        return {success:true, resume};
    }

}