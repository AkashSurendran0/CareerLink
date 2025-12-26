import { inject, injectable } from "inversify";
import { IDeleteConversation } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { IChatRepository } from "../domain/repository/IChatRepository";

@injectable()
export class DeleteConversation implements IDeleteConversation {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository,
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async deleteConversation(user1: string, user2: string): Promise<{ success: boolean; }> {
        const convo=await this._conversationRepository.findByUsers(user1, user2)
        console.log(convo)
        if(convo.success){
            await this._conversationRepository.deleteConversation(convo.conversation?._id)
            await this._chatRepository.deleteChat(convo.conversation?._id)
        }
        return {success:true}
    }

}