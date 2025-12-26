import { injectable } from "inversify";
import { IChatRepository } from "../../domain/repository/IChatRepository";
import { Chat, Content } from "../../domain/entity/Chat";
import { ChatModel } from "../models/ChatModel";
import { ObjectId } from 'mongodb'

@injectable()
export class ChatRepository implements IChatRepository {

    async sendMessage(sender: string, message: string, conversation: string): Promise<Chat> {
        const newMessage = await ChatModel.findOneAndUpdate(
            { conversation },
            {
                $push: {
                    content: { sendBy: sender, message: message }
                }
            },
            {
                upsert: true,
                new: true
            },
        )
        const contents = newMessage.content.map((item) => new Content(
            item._id.toString(),
            item.sendBy,
            item.isRead,
            item.sendAt,
            item.time,
            item.date,
            item.message,
            item.isScheduleMessage
        ))
        return new Chat(
            newMessage._id.toString(),
            newMessage.conversation,
            contents,
            newMessage.createdAt,
        )
    }

    async getByConvo(convo: string): Promise<Chat | null> {
        const messages = await ChatModel.findOne({ conversation: convo })
        if (!messages) return null
        const contents = messages?.content.map((item) => new Content(
            item._id.toString(),
            item.sendBy,
            item.isRead,
            item.sendAt,
            item.time,
            item.date,
            item.message,
            item.isScheduleMessage
        ))
        return new Chat(
            messages._id.toString(),
            messages.conversation,
            contents,
            messages.createdAt,
        )
    }

    async readMessages(convo: string, user: string): Promise<{ success: boolean; }> {
        await ChatModel.updateMany(
            { conversation: convo },
            {
                $set: { 'content.$[msg].isRead': true }
            },
            {
                arrayFilters: [
                    {
                        "msg.sendBy": { $ne: user },
                        "msg.isRead": false
                    }
                ]
            }
        )
        return { success: true }
    }

    async getLastMessageAndCount(convo: string, id: string): Promise<any> {
        const chats = await ChatModel.findOne({ conversation: convo })
        let lastMessage = null, unreadCount = null
        if (chats) {
            // lastMessage=chats?.content[chats.content.length - 1]
            let lastMessageResult = await ChatModel.aggregate([
                { $match: { conversation: convo.toString() } },
                { $unwind: '$content' },
                {
                    $match:
                    {
                        'content.sendBy': { $ne: id },
                    },
                },
            ])
            lastMessage = lastMessageResult[lastMessageResult.length - 1]
            let unreadCountResult = await ChatModel.aggregate([
                { $match: { conversation: convo.toString() } },
                { $unwind: '$content' },
                {
                    $match:
                    {
                        'content.sendBy': { $ne: id },
                        'content.isRead': false
                    },
                },
            ])
            unreadCount = unreadCountResult.length
        }
        return { lastMessage, unreadCount }
    }

    async getReportedMessage(convo: string, chatId: string): Promise<Chat> {
        const chats = await ChatModel.aggregate([
            {
                $match: {
                    conversation: convo.toString()
                }
            },
            {
                $addFields: {
                    targetIndex: {
                        $indexOfArray: ["$content._id", new ObjectId(chatId)]
                    },
                    contentSize: { $size: "$content" }
                }
            },
            {
                $addFields: {
                    startIndex: {
                        $max: [{ $subtract: ["$targetIndex", 5] }, 0]
                    },
                    endIndex: {
                        $min: [
                            { $add: ["$targetIndex", 5] },
                            { $subtract: ["$contentSize", 1] }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    sliceLength: {
                        $add: [
                            { $subtract: ["$endIndex", "$startIndex"] },
                            1
                        ]
                    }
                }
            },
            {
                $project: {
                    content: {
                        $slice: ["$content", "$startIndex", "$sliceLength"]
                    }
                }
            }
        ]);

        const contents = chats[0]?.content?.map((item: any) => new Content(
            item._id.toString(),
            item.sendBy,
            item.isRead,
            item.sendAt,
            item.time,
            item.date,
            item.message,
            item.isScheduleMessage
        ))

        const chatDoc = chats[0];

        return new Chat(
            (chatDoc?._id || new ObjectId()).toString(),
            chatDoc?.conversation || '',
            contents || [],
            chatDoc?.createdAt || new Date(),
        )
    }

    async scheduleCall(data: { convoId: string; date: Date; time: string; }, companyId: string): Promise<Chat> {
        const { convoId, date, time } = data
        const newMessage = await ChatModel.findOneAndUpdate(
            { conversation: convoId },
            {
                $push: {
                    content: {
                        isScheduleMessage: true,
                        sendBy: companyId,
                        date: date,
                        time: time,
                    }
                }
            },
            {
                upsert: true,
                new: true
            },
        )
        const contents = newMessage.content.map((item) => new Content(
            item._id.toString(),
            item.sendBy,
            item.isRead,
            item.sendAt,
            item.time,
            item.date,
            item.message,
            item.isScheduleMessage
        ))
        return new Chat(
            newMessage._id.toString(),
            newMessage.conversation,
            contents,
            newMessage.createdAt,
        )
    }

    async deleteChat(id: string): Promise<{ success: boolean; }> {
        const chatExist = await ChatModel.findOne({ conversation: id })
        if (chatExist) {
            const result = await ChatModel.deleteOne({ conversation: id })
        }
        return { success: true }
    }

}