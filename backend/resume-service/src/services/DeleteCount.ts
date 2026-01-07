import { inject, injectable } from "inversify";
import { IDeleteCount } from "../domain/services/IResumeServices";
import { TYPES } from "../types";
import { ICountRepository } from "../domain/repository/ICountRepository";

@injectable()
export class DeleteCount implements IDeleteCount {

    constructor(
        @inject(TYPES.ICountRepository) private _countRepository:ICountRepository
    ){}

    async deleteCount(id: string): Promise<{ success: boolean; }> {
        const result=await this._countRepository.deleteCount(id);
        return result;
    }

}