import { inject, injectable } from "inversify";
import { IGetUserAppliedJobs } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";
import { IJobRepository } from "../../domain/repositories/IJobRepository";

@injectable()
export class GetUserAppliedJobs implements IGetUserAppliedJobs {

    constructor(
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository: IJobApplicationsRepository,
        @inject(TYPES.IJobRepository) private _jobRepository: IJobRepository
    ) { }

    async getJobs(user: string): Promise<{ success: boolean; } | { success: boolean; jobs: any[]; }> {
        let jobs = await this._jobApplicationRepository.getUserApplications(user)
        if ('jobs' in jobs && jobs.success) {
            const details = new Set<string>()
            jobs.jobs.forEach((i: any) => {
                details.add(i.jobPost)
            })
            for (let id of details) {
                let result = await this._jobRepository.findDetails(id)
                for (let i = 0; i < jobs.jobs.length; i++) {
                    if (jobs.jobs[i].jobPost == id) {
                        jobs.jobs[i].details = result
                    }
                }
            }
        }
        return jobs
    }

}