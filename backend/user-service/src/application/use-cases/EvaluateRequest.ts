import { inject, injectable } from "inversify";
import { IEvaluateRequest } from "../../domain/use-cases/IConnectionUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { rabbitmqService } from "../../utils/Rabbitmq";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

@injectable()
export class EvaluateRequest implements IEvaluateRequest {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository,
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository
    ) {}

    async evaluateRequest(user: string, id: string, action: string): Promise<{ success: boolean; }> {
        if(action == "accept"){
            const sender=await this._userRepository.findById(id);
            const reciever=await this._userRepository.findById(user);
            const result=await this._connectionRepository.acceptConnection(user, id);
            await rabbitmqService.publishEvent("connection.events", "connection.acceptRequest", {
                sender:sender?.username,
                reciever:reciever?.email,
                action:"acceptRequest"
            });
            return result;
        }else if(action == "reject"){
            const result=await this._connectionRepository.rejectConnection(user, id);
            return result;
        }else{
            return {success:false};
        }
    }

}