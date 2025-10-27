import { IGetJobDetails } from "../../domain/use-cases/IJobUseCase";
import { JobDTO } from "../../dto/JobDTO";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";
import { JobMapper } from "../../mapper/JobMapper";

@injectable()
export class GetJobDetails implements IGetJobDetails {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async getDetails(id: string): Promise<JobDTO> {
        const details=await this._jobRepository.findDetails(id)
        return JobMapper.toDTO(details)
    }

}