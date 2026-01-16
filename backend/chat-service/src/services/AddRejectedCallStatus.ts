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
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async addRejectCallStatus(convo: string): Promise<ChatDto | {success:boolean}> {
        await this._chatRepository.addRejectedCallStatus(convo);
        const result=await this._chatRepository.getByConvo(convo);
        if(!result) return {success:false};
        return ChatMapper.toDTO(result);
    }

}