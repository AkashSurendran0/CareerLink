import { inject, injectable } from "inversify";
import { ISendMessage } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IChatRepository } from "../domain/repository/IChatRepository";
import { ChatDto } from "../dto/ChatDto";
import { ChatMapper } from "../mapper/ChatMapper";

@injectable()
export class SendMessage implements ISendMessage {

    constructor(
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async sendMessage(sender: string, message: string, conversation: string): Promise<ChatDto> {
        const result=await this._chatRepository.sendMessage(sender, message, conversation);
        return ChatMapper.toDTO(result);
    }

}