import { inject, injectable } from "inversify";
import { IGetJobApplicants } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";
import { JobApplicationDto } from "../../dto/JobApplicationDTO";
import { JobApplicationMapper } from "../../mapper/JobApplicationMapper";

@injectable()
export class GetJobApplicants implements IGetJobApplicants {

    constructor(
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository:IJobApplicationsRepository
    ){}

    async getApplicants(id: string, filter:string): Promise<any> {
        let result=await this._jobApplicationRepository.getJobApplicants(id, filter)
        return result
    }

}