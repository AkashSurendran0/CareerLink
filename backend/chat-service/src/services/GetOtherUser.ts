import { inject, injectable } from "inversify";
import { IGetOtherUser } from "../domain/services/IChatServices";
import { TYPES } from "../types";
import { IConversationRepository } from "../domain/repository/IConversationRepository";

@injectable()
export class GetOtherUser implements IGetOtherUser {

    constructor(
        @inject(TYPES.IConversationRepository) private _conversationRepository:IConversationRepository
    ){}

    async getOtherUser(reportedUser: string, convo: string): Promise<{ isCompany: boolean; id: string; }> {
        const result=await this._conversationRepository.getOtherUser(reportedUser, convo);
        return result;
    }

}