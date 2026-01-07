import { injectable, inject } from "inversify";
import { IApplyJob } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";

@injectable()
export class ApplyJob implements IApplyJob {
    
    constructor(
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository:IJobApplicationsRepository
    ){}

    async applyJob(data: { id: string; resumeUrl: string; coverLetter?: string }, user:string): Promise<{ success: boolean; }> {
        const {
            id,
            resumeUrl,
            coverLetter
        } = data;
        const result=await this._jobApplicationRepository.addApplications(user, id, resumeUrl, coverLetter ?? "");
        return result;
    }

}