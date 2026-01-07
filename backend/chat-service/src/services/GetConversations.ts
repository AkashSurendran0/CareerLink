import { inject, injectable } from "inversify";
import { IGetConversations } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { IChatRepository } from "../domain/repository/IChatRepository";
import { Conversation } from "../domain/entity/Conversation";

@injectable()
export class GetConversations implements IGetConversations {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository: IConversationRepository,
        @inject(TYPES.IChatRepository) private _chatRepository: IChatRepository
    ) { }

    async getConversations(id: string): Promise<Conversation[]> {
        let result = await this._conversationRepository.getConversations(id);
        for (let i = 0; i < result.length; i++) {
            if (result[i]) {
                const lastMessageCount = await this._chatRepository.getLastMessageAndCount(result[i]!._id, id);
                result[i]!.lastMessage = lastMessageCount.lastMessage;
                result[i]!.unreadCount = lastMessageCount.unreadCount;
            }
        }
        return result;
    }

}