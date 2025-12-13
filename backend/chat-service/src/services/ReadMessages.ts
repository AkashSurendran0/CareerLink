import { inject, injectable } from "inversify";
import { IReadMessages } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IChatRepository } from "../domain/repository/IChatRepository";

@injectable()
export class ReadMessages implements IReadMessages { 

    constructor(
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}    

    async readMessages(convo: string, user: string): Promise<{ success: boolean; }> {
        const result=await this._chatRepository.readMessages(convo, user)
        return result
    }

}