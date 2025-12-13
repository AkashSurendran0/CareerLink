import { injectable } from "inversify";
import { IChatRepository } from "../../domain/repository/IChatRepository";
import { Chat, Content } from "../../domain/entity/Chat";
import { ChatModel } from "../models/ChatModel";

@injectable()
export class ChatRepository implements IChatRepository {

    async sendMessage(sender: string, message: string, conversation: string): Promise<Chat> {
        const newMessage=await ChatModel.findOneAndUpdate(
            {conversation},
            {$push:{
                content:{sendBy:sender, message:message}
            }},
            {
                upsert:true,
                new: true
            },
        )
        const contents=newMessage.content.map((item)=> new Content (
            item._id, 
            item.sendBy, 
            item.message, 
            item.isRead, 
            item.sendAt
        ) )
        return new Chat (
            newMessage._id,
            newMessage.conversation,
            contents,
            newMessage.createdAt
        )
    }

    async getByConvo(convo: string): Promise<Chat> {
        const messages=await ChatModel.findOne({conversation:convo})
        if(!messages) return null
        const contents=messages?.content.map((item) => new Content (
            item._id, 
            item.sendBy, 
            item.message, 
            item.isRead, 
            item.sendAt
        ))
        return new Chat (
            messages._id,
            messages.conversation,
            contents,
            messages.createdAt
        )
    }

    async readMessages(convo: string, user: string): Promise<{ success: boolean; }> {
        await ChatModel.updateMany(
            {conversation:convo},
            {
                $set:{'content.$[msg].isRead':true}
            },
            {arrayFilters:[
                {
                    "msg.sendBy":{$ne:user},
                    "msg.isRead":false
                }
            ]}
        )
        return {success:true}
    }

}