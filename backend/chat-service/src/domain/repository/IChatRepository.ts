import { Chat } from "../entity/Chat";

export interface IChatRepository {
    sendMessage(sender:string, message:string, conversation:string): Promise<Chat>
    getByConvo(convo:string): Promise<Chat>
    readMessages(convo:string, user:string): Promise<{success:boolean}>
    getLastMessageAndCount(convo:string, id:string): Promise<any>
    getReportedMessage(convo:string, chatId:string): Promise<Chat>
}