import { inject, injectable } from "inversify";
import { IGetJobApplicationAnalytics } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";

@injectable()
export class GetJobApplicationAnalytics implements IGetJobApplicationAnalytics {

    constructor(
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository:IJobApplicationsRepository
    ){}

    async getJobApplicationAnalytics(): Promise<any> {
        const result=await this._jobApplicationRepository.getJobApplicationAnalytics()
        return result
    }

}