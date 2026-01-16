import { inject, injectable } from "inversify";
import { IAddAcceptedCallStatus } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";
import { IChatRepository } from "../domain/repository/IChatRepository";

@injectable()
export class AddAcceptedCallStatus implements IAddAcceptedCallStatus {

    constructor(
        @inject(TYPES.IChatRepository) private _chatRepository:IChatRepository
    ){}

    async addAcceptedCallStatus(convo: string, duration: string): Promise<{ success: boolean; }> {
        const result=await this._chatRepository.addAcceptedCallStatus(convo, duration);
        return result;
    }

}