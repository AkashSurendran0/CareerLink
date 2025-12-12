import { inject, injectable } from "inversify";
import { IGetChats } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IChatRepository } from "../domain/repository/IChatRepository";
import { ChatDto } from "../dto/ChatDto";
import { ChatMapper } from "../mapper/ChatMapper";

@injectable()
export class GetChats implements IGetChats {
    
    constructor(
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async getChats(convo: string): Promise<ChatDto> {
        const result=await this._chatRepository.getByConvo(convo)
        return ChatMapper.toDTO(result)
    }

}