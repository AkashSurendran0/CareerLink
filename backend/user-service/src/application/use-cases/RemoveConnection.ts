import { inject, injectable } from "inversify";
import { IRemoveConnection } from "../../domain/use-cases/IConnectionUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";

@injectable()
export class RemoveConnection implements IRemoveConnection {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectRepository:IConnectionRepository,
    ) {}

    async removeConnection(id: string, user:string): Promise<{ success: boolean; }> {
        const result=await this._connectRepository.removeConnection(id, user);
        return result;
    }

}   