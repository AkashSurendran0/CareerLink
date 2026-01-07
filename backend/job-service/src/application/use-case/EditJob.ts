import { inject, injectable } from "inversify";
import { IEditJob } from "../../domain/use-cases/IJobUseCase";
import { JobDTO } from "../../dto/JobDTO";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";

@injectable()
export class EditJob implements IEditJob {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async editJob(jobDetails: Partial<JobDTO> & { _id: string }): Promise<{ success: boolean; }> {
        const payload = jobDetails as unknown as Record<string, unknown> & { _id: string };
        const result=await this._jobRepository.editJob(payload);
        return result;
    }

}