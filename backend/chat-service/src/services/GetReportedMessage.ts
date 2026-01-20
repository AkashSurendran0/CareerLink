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

    async getReportedMessage(convo:string, chatId: string): Promise<ChatDto> {
        const chats = await this._chatRepository.getReportedMessage(convo, chatId);
        return ChatMapper.toDTO(chats);
    }

} 