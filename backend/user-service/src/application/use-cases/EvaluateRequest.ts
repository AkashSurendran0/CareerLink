import { inject, injectable } from "inversify";
import { IEvaluateRequest } from "../../domain/use-cases/IConnectionUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";

@injectable()
export class EvaluateRequest implements IEvaluateRequest {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository
    ) {}

    async evaluateRequest(user: string, id: string, action: string): Promise<{ success: boolean; }> {
        if(action == "accept"){
            const result=await this._connectionRepository.acceptConnection(user, id);
            return result;
        }else if(action == "reject"){
            const result=await this._connectionRepository.rejectConnection(user, id);
            return result;
        }else{
            return {success:false};
        }
    }

}