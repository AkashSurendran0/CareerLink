import { ChatDto } from "../dto/ChatDto";
import { Chat, Content } from "../domain/entity/Chat";
import { IChat, IChatContent } from "../infrastructure/models/ChatModel";

export class ChatMapper {
    static toDTO(chat: Chat | IChat): ChatDto {
        return {
            _id: String(chat._id),
            conversation: chat.conversation,
            content: (chat.content ?? []).map((item: IChatContent | Content) => ({
                _id: String(item._id),
                sendBy: item.sendBy ?? "",
                isScheduleMessage: Boolean(item.isScheduleMessage),
                callStatus: item.callStatus ?? "",
                duration: item.duration ?? "",
                time: item.time ?? "",
                date: item.date ?? "",
                message: item.message ?? "",
                attachment: item.attachment ?? "",
                isRead: Boolean(item.isRead),
                sendAt: (item.sendAt instanceof Date) ? item.sendAt : new Date(String(item.sendAt ?? Date.now()))
            })),
            createdAt: (chat.createdAt instanceof Date) ? chat.createdAt : new Date(String(chat.createdAt ?? Date.now()))
        };
    }
} 