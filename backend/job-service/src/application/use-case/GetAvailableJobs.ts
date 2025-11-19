import { IGetAvailableJobs } from "../../domain/use-cases/IJobUseCase";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { JobDTO } from "../../dto/JobDTO";
import { JobMapper } from "../../mapper/JobMapper";

@injectable()
export class GetAvailableJobs implements IGetAvailableJobs {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async getAvailableJobs(query:string): Promise<JobDTO[]> {
        let jobs=await this._jobRepository.getAvailableJobs(query)
        return jobs.map(job=>JobMapper.toDTO(job))
    }

}