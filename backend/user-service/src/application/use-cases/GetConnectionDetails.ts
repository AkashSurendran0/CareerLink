import { inject, injectable } from "inversify";
import { IGetConnectionDetails } from "../../domain/use-cases/IConnectionUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";

@injectable()
export class GetConnectionDetails implements IGetConnectionDetails {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository
    ) {}

    async getConnectionDetails(id: string, user: string): Promise<{connection:string}> {
        console.log(id, user)
        const connection=await this._connectionRepository.findByUser(id);
        console.log(connection)
        if(connection?.pendings.includes(user)) return {connection:"pending"};
        if(connection?.connections.includes(user)) return {connection:"connection"};
        return {connection:"none"};
    }

}