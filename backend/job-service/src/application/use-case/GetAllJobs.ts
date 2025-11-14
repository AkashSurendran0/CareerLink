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

    async getAllJobs(id: string, start:number, limit:number, query:string | undefined, filter:string): Promise<{jobs:JobDTO[], limit:number, count:number}> {
        const jobs=await this._jobRepository.getAllJobs(id, filter)
        const jobCount=jobs.length
        const pageLimit=Math.ceil(jobCount/limit)
        const resultJobs=await this._jobRepository.getQueryJobs(id, start, limit, query, filter)
        const result=await resultJobs.map(job=>JobMapper.toDTO(job))
        return {jobs:result, limit:pageLimit, count:jobCount}
    }

}