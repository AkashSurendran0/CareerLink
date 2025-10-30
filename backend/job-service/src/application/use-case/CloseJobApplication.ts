import { inject, injectable } from "inversify";
import { ICloseJobApplication } from "../../domain/use-cases/IJobUseCase";
import { TYPES } from "../../types";
import { IJobRepository } from "../../domain/repositories/IJobRepository";

@injectable()
export class CloseJobApplication implements ICloseJobApplication {

    constructor(
        @inject(TYPES.IJobRepository) private _jobRepository:IJobRepository
    ){}

    async closeJob(id: string): Promise<{ success: boolean; }> {
        const result=await this._jobRepository.closeJob(id)
        return result
    }

}