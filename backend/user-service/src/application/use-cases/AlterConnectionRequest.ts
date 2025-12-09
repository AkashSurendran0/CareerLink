import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { IAlterConnectionRequest } from "../../domain/use-cases/IConnectionUseCase";

@injectable()
export class AlterConnectionRequest implements IAlterConnectionRequest {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository
    ) {}

    async alterConnectionRequest(user: string, id: string, action:string): Promise<{ success: boolean; } | {success:boolean, message:string}> {
        if(action=="send"){
            const result=await this._connectionRepository.sendConnection(user, id);
            return result;
        }else if(action=="cancel"){
            const result=await this._connectionRepository.cancelConnectionRequest(user, id);
            return result;
        }else{
            return {success:false, message:"Error occured, please refresh the page and try again"};
        }
    }

}