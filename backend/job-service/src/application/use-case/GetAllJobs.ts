import { IGetAllJobs } from "../../domain/use-cases/IJobUseCase";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { JobDTO } from "../../dto/JobDTO";
import { JobMapper } from "../../mapper/JobMapper";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";

@injectable()
export class GetAllJobs implements IGetAllJobs {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository: IJobRepository,
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository: IJobApplicationsRepository
    ) { }

    async getAllJobs(id: string, start: number, limit: number, query: string | undefined, filter: string): Promise<{ jobs: JobDTO[], limit: number, count: number }> {
        const jobs = await this._jobRepository.getAllJobs(id, filter);
        const jobCount = jobs.length;
        const pageLimit = Math.ceil(jobCount / limit);
        const resultJobs = await this._jobRepository.getQueryJobs(id, start, limit, query, filter);
        let result = await resultJobs.map(job => JobMapper.toDTO(job));
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const jobId = result[i]?._id;
                if (jobId) {
                    const length = await this._jobApplicationRepository.getCount(jobId);
                    result[i]!.count = length;
                }
            }
        }
        return { jobs: result, limit: pageLimit, count: jobCount };
    }

}