import { inject, injectable } from "inversify";
import { IGetReportedMessage } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IChatRepository } from "../domain/repository/IChatRepository";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { ChatDto } from "../dto/ChatDto";
import { ChatMapper } from "../mapper/ChatMapper";

@injectable()
export class GetReportedMessage implements IGetReportedMessage {

    constructor(
        @inject(TYPES.IChatRepository) private _chatRepository: IChatRepository,
        @inject(TYPES.IConversationRepository) private _conversationRepository: IConversationRepository
    ) { }

    async getReportedMessage(user1: string, user2: string, chatId: string): Promise<ChatDto> {
        const convo = await this._conversationRepository.findByUsers(user1, user2);
        if (!convo || !convo.conversation) return {} as ChatDto;
        const chats = await this._chatRepository.getReportedMessage(convo.conversation._id, chatId);
        return ChatMapper.toDTO(chats);
    }

}