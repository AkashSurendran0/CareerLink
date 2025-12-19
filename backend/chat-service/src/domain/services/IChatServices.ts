import { ChatDto } from "../../dto/ChatDto"

export interface IStartConversation {
    startConversation(id:string, user:string, isCompany:boolean):Promise<{success:boolean, id:string}>
}

export interface IGetConversations {
    getConversations(id:string): Promise<any>
}

export interface ISendMessage {
    sendMessage(sender:string, message:string, conversation:string): Promise<ChatDto>
}

export interface IGetChats {
    getChats(convo:string, user:string): Promise<ChatDto | null>
}

export interface IReadMessages {
    readMessages(convo:string, user:string): Promise<{success:boolean}>
}

export interface IGetReportedMessage {
    getReportedMessage(user1:string, user2:string, chatId:string): Promise<ChatDto>
}