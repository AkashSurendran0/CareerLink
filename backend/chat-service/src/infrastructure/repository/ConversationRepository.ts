import { injectable } from "inversify";
import { IConversationRepository } from "../../domain/repository/IConversationRepository";
import { ConversationModel } from "../models/ConversationModel";
import { Conversation } from "../../domain/entity/Conversation";

@injectable()
export class ConversationRepository implements IConversationRepository {

    async addConversation(user1: string, user2: string, isCompany:boolean): Promise<{ success: boolean, id:string}> {
        const existingConversation=await ConversationModel.findOne({users:{$all:[user1, user2]}})
        if(existingConversation) return {success:true, id:existingConversation._id}
        let conversation
        if(isCompany){
            conversation=await ConversationModel.insertOne({
                isCompany:true,
                users:[user1, user2]
            })
        }else{
            conversation=await ConversationModel.insertOne({
                isCompany:false,
                users:[user1, user2]
            })
        }
        return {success:true, id:conversation._id}
    }

    async getConversations(id: string): Promise<Conversation[]> {
        const userConversations=await ConversationModel.aggregate([
            {$match:{
                users:{$in:[id]}
            }},
            {$unwind:'$users'},
            {$match:{
                users:{$ne:id}
            }}
        ])
        return userConversations.map((convo)=>(
            new Conversation(
                convo._id,
                convo.isCompany,
                convo.users,
                convo.createdAt
            )
        ))
    }

}