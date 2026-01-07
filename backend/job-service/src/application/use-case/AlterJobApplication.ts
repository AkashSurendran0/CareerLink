import { inject, injectable } from "inversify";
import { IAlterUserApplication } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";
import { rabbitmqService } from "../../utils/Rabbitmq";

@injectable()
export class AlterUserApplication implements IAlterUserApplication {

    constructor(
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository:IJobApplicationsRepository
    ){}

    async acceptApplication(job: string, user: string): Promise<{ success: boolean; }> {
        const result=await this._jobApplicationRepository.acceptApplication(job, user);
        return result;
    }

    async rejectApplication(job: string, user: string): Promise<{ success: boolean; }> {
        const result=await this._jobApplicationRepository.rejectApplication(job, user);
        return result;
    }

    async hireUser(job: string, user: string): Promise<{ success: boolean; }> {
        const result=await this._jobApplicationRepository.hireApplication(job, user);
        return result;
    }

}