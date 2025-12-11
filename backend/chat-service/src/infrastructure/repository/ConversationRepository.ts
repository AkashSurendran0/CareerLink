import { injectable } from "inversify";
import { IConversationRepository } from "../../domain/repository/IConversationRepository";
import { ConversationModel } from "../models/ConversationModel";

@injectable()
export class ConversationRepository implements IConversationRepository {

    async addConversation(user1: string, user2: string): Promise<{ success: true; }> {
        const existingConversation=await ConversationModel.findOne({users:{$all:[user1, user2]}})
        if(existingConversation) return {success:true}
        await ConversationModel.insertOne({users:[user1, user2]})
        return {success:true}
    }

}