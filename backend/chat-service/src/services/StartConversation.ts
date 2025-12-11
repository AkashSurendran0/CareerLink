import { inject, injectable } from "inversify";
import { IStartConversation } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";

@injectable()
export class StartCoversation implements IStartConversation {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository
    ){}

    async startConversation(id: string, user: string): Promise<{ success: boolean; }> {
        const result=await this._conversationRepository.addConversation(id, user)
        return result
    }

}