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

    async getChats(convo: string, user:string): Promise<ChatDto | null> {
        await this._chatRepository.readMessages(convo, user)
        const result=await this._chatRepository.getByConvo(convo)
        if(!result) return null
        return ChatMapper.toDTO(result)
    }

}