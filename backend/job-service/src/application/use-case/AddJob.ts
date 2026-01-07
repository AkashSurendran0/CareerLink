import { IAddJob } from "../../domain/use-cases/IJobUseCase";
import { injectable, inject } from "inversify";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { TYPES } from "../../types";

type JobDetails = {
    jobTitle:string,
    department:string,
    jobType:string,
    location:string,
    jobDescription:string,
    experienceLevel:string,
    applicationDeadline:Date,
    finalQualifications:string[],
    finalResponsibilities:string[],
    finalBenefits:string[] | null
}

@injectable()
export class AddJob implements IAddJob {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async addJob(jobDetails:JobDetails, id:string): Promise<{ success: boolean; }> {
        const result=await this._jobRepository.addJob(jobDetails, id);
        return result;
    }

}