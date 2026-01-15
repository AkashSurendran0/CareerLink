import { Chat } from "../entity/Chat";

type Data = {
    convoId: string,
    date: Date,
    time: string
}

export interface IChatRepository {
    sendMessage(sender: string, message: string, conversation: string): Promise<Chat>
    getByConvo(convo: string): Promise<Chat | null>
    readMessages(convo: string, user: string): Promise<{ success: boolean }>
    getLastMessageAndCount(convo: string, id: string): Promise<{ lastMessage: unknown | null; unreadCount: number | null }>
    getReportedMessage(convo: string, chatId: string): Promise<Chat>
    scheduleCall(data: Data, companyId: string): Promise<Chat>
    deleteChat(id: string): Promise<{ success: boolean }>
    addAcceptedCallStatus(convoId:string, duration:string): Promise<{success:boolean}>
}