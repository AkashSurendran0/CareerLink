import { ChatDto } from "../dto/ChatDto";

export class ChatMapper {
    static toDTO(chat: any): ChatDto {
        return {
            _id: String(chat._id),
            conversation: chat.conversation,
            content: (chat.content ?? []).map((item: any) => ({
                _id: String(item._id),
                sendBy: item.sendBy,
                isScheduleMessage: Boolean(item.isScheduleMessage),
                time: item.time,
                date: item.date,
                message: item.message,
                isRead: Boolean(item.isRead),
                sendAt: item.sendAt
            })),
            createdAt: chat.createdAt
        }
    }
}