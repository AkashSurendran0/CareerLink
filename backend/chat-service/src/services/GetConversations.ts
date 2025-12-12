import { inject, injectable } from "inversify";
import { IGetConversations } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";

@injectable()
export class GetConversations implements IGetConversations {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository
    ){}

    async getConversations(id: string): Promise<any> {
        const result=await this._conversationRepository.getUserConversations(id)
        return result
    }

}