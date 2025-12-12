import { Chat } from "../entity/Chat";

export interface IChatRepository {
    sendMessage(sender:string, message:string, conversation:string): Promise<Chat>
    getByConvo(convo:string): Promise<Chat>
}