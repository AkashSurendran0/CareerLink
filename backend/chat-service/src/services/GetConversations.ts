import { inject, injectable } from "inversify";
import { IGetConversations } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { IChatRepository } from "../domain/repository/IChatRepository";

@injectable()
export class GetConversations implements IGetConversations {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository,
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async getConversations(id: string): Promise<any> {
        let result=await this._conversationRepository.getConversations(id)
        console.log(result)
        for(let i=0;i<result.length;i++){
            const lastMessageCount=await this._chatRepository.getLastMessageAndCount(result[i]._id, id)
            result[i].lastMessage=lastMessageCount.lastMessage
            result[i].unreadCount=lastMessageCount.unreadCount
        }
        return result
    }

}