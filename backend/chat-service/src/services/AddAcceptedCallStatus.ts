import { inject, injectable } from "inversify";
import { IAddAcceptedCallStatus } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { IChatRepository } from "../domain/repository/IChatRepository";

@injectable()
export class AddAcceptedCallStatus implements IAddAcceptedCallStatus {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository,
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async addAcceptedCallStatus(user1: string, user2: string, duration: string): Promise<{ success: boolean; }> {
        const convo=await this._conversationRepository.findByUsers(user1, user2);
        if(!convo.success) return {success:false};
        const result=await this._chatRepository.addAcceptedCallStatus(convo.conversation?._id as string, duration);
        return result;
    }

}