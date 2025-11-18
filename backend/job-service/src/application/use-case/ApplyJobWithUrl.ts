import { injectable, inject } from "inversify";
import { IApplyJobWithUrl } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";

@injectable()
export class ApplyJobWithUrl implements IApplyJobWithUrl {
    
    constructor(
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository:IJobApplicationsRepository
    ){}

    async applyJob(data: any, user:string): Promise<{ success: boolean; }> {
        const {
            id, 
            resumeUrl,
            coverLetter
        }=data
        const result=await this._jobApplicationRepository.addApplications(user, id, resumeUrl, coverLetter)
        return result
    }

}