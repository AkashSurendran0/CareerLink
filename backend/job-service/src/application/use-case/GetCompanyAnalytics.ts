import { inject, injectable } from "inversify";
import { IGetCompanyAnalytics } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";

@injectable()
export class GetCompanyAnalytics implements IGetCompanyAnalytics {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async getCompanyAnalytics(): Promise<Array<{ _id: string; count: number }>> {
        const result=await this._jobRepository.getJobAnalytics();
        return result;
    }

}