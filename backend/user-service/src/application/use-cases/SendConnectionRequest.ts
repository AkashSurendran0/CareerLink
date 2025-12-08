import { inject, injectable } from "inversify";
import { ISendConnectionRequest } from "../../domain/use-cases/IUserUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";

@injectable()
export class SendConnectionRequest implements ISendConnectionRequest {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository
    ) {}

    async sendConnection(user: string, id: string): Promise<{ success: boolean; }> {
        const result=await this._connectionRepository.sendConnection(user, id);
        return result;
    }

}