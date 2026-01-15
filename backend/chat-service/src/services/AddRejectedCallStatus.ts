import { inject, injectable } from "inversify";
import { IAddRejectedCallStatus } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { IChatRepository } from "../domain/repository/IChatRepository";
import { ChatDto } from "../dto/ChatDto";
import { ChatMapper } from "../mapper/ChatMapper";

@injectable()
export class AddRejectedCallStatus implements  IAddRejectedCallStatus {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository,
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async addRejectCallStatus(user1: string, user2: string): Promise<ChatDto | {success:boolean}> {
        const convo=await this._conversationRepository.findByUsers(user1, user2);
        if(!convo) return {success:false};
        await this._chatRepository.addRejectedCallStatus(convo.conversation?._id as string);
        const result=await this._chatRepository.getByConvo(convo.conversation?._id as string);
        if(!result) return {success:false};
        return ChatMapper.toDTO(result);
    }

}