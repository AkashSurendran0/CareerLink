import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { IAlterConnectionRequest } from "../../domain/use-cases/IConnectionUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { rabbitmqService } from "../../utils/Rabbitmq";

@injectable()
export class AlterConnectionRequest implements IAlterConnectionRequest {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository,
        @inject(TYPES.IUserRepository) private _userRepostitory:IUserRepository
    ) {}

    async alterConnectionRequest(user: string, id: string, action:string): Promise<{ success: boolean; } | {success:boolean, message:string}> {
        if(action=="send"){
            const sender=await this._userRepostitory.findById(id);
            const reciever=await this._userRepostitory.findById(user);
            const result=await this._connectionRepository.sendConnection(user, id);
            await rabbitmqService.publishEvent("connection.events", "connection.sendRequest", {
                sender:sender?.username,
                reciever:reciever?.email,
                action:"sendRequest"
            });
            return result;
        }else if(action=="cancel"){
            const result=await this._connectionRepository.cancelConnectionRequest(user, id);
            return result;
        }else{
            return {success:false, message:"Error occured, please refresh the page and try again"};
        }
    }

}