import { IGetAllJobs } from "../../domain/use-cases/IJobUseCase";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { JobDTO } from "../../dto/JobDTO";
import { JobMapper } from "../../mapper/JobMapper";

@injectable()
export class GetAllJobs implements IGetAllJobs {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async getAllJobs(id: string): Promise<JobDTO[]> {
        const jobs=await this._jobRepository.getAllJobs(id)
        const result=await jobs.map(job=>JobMapper.toDTO(job))
        return result
    }

}