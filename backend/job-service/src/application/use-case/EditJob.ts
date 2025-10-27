import { inject } from "inversify";
import { IEditJob } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";

export class EditJob implements IEditJob {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async editJob(jobDetails: any): Promise<{ success: boolean; }> {
        const result=await this._jobRepository.editJob(jobDetails)
        return result
    }

}