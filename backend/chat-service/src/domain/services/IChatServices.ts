import { ChatDto } from "../../dto/ChatDto"

export interface IStartConversation {
    startConversation(id:string, user:string):Promise<{success:boolean}>
}

export interface IGetConversations {
    getConversations(id:string): Promise<any>
}

export interface ISendMessage {
    sendMessage(sender:string, message:string, conversation:string): Promise<ChatDto>
}

export interface IGetChats {
    getChats(convo:string): Promise<ChatDto | null>
}