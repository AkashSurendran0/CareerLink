import { IGetAvailableJobs } from "../../domain/use-cases/IJobUseCase";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { JobDTO } from "../../dto/JobDTO";
import { JobMapper } from "../../mapper/JobMapper";
import { IJobApplicationsRepository } from "../../domain/repositories/IJobApplicationsRepository";

@injectable()
export class GetAvailableJobs implements IGetAvailableJobs {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository,
        @inject(TYPES.IJobApplicationsRepository) private _jobApplicationRepository:IJobApplicationsRepository
    ){}

    async getAvailableJobs(query:string, user:string): Promise<JobDTO[]> {
        let jobs=await this._jobRepository.getAvailableJobs(query)
        let result=[]
        console.log(user)
        for(let job of jobs){
            let include=false
            const application=await this._jobApplicationRepository.getJobApplicants(job._id)
            if(application){
                for (const app of application.applicants){
                    if(app.user==user){
                        include=true
                    }
                    if(include) break
                }
            }
            if(!include) result.push(job)
        }
        return result.map(job=>JobMapper.toDTO(job))
    }

}