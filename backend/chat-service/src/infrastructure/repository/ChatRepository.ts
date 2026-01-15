import { injectable } from "inversify";
import { IChatRepository } from "../../domain/repository/IChatRepository";
import { Chat, Content } from "../../domain/entity/Chat";
import { ChatModel, IChat, IChatContent } from "../models/ChatModel";
import mongoose from "mongoose";

@injectable()
export class ChatRepository implements IChatRepository {

    async sendMessage(sender: string, message: string, conversation: string): Promise<Chat> {
        const newMessage = await ChatModel.findOneAndUpdate(
            { conversation },
            { $push: { content: { sendBy: sender, message: message } } },
            { upsert: true, new: true }
        ) as IChat | null;
        if (!newMessage) throw new Error("Failed to send message");
        const contents = (newMessage.content ?? []).map((item: IChatContent | Content) => new Content(
            String(item._id),
            Boolean(item.isRead),
            item.sendAt as Date,
            item.sendBy,
            item.time,
            item.date,
            item.message,
            Boolean(item.isScheduleMessage),
            item.callStatus,
            item.duration,
        ));
        return new Chat(
            String(newMessage._id),
            newMessage.conversation,
            contents,
            newMessage.createdAt ?? new Date(),
        );
    }

    async getByConvo(convo: string): Promise<Chat | null> {
        const messages = await ChatModel.findOne({ conversation: convo }) as IChat | null;
        if (!messages) return null;
        const contents = (messages.content ?? []).map((item: IChatContent | Content) => new Content(
            String(item._id),
            Boolean(item.isRead),
            item.sendAt as Date,
            item.sendBy,
            item.time,
            item.date,
            item.message,
            Boolean(item.isScheduleMessage),
            item.callStatus,
            item.duration,
        ));
        return new Chat(
            String(messages._id),
            messages.conversation,
            contents,
            messages.createdAt ?? new Date(),
        );
    }

    async readMessages(convo: string, user: string): Promise<{ success: boolean; }> {
        await ChatModel.updateMany(
            { conversation: convo },
            {
                $set: { "content.$[msg].isRead": true }
            },
            {
                arrayFilters: [
                    {
                        "msg.sendBy": { $ne: user },
                        "msg.isRead": false
                    }
                ]
            }
        );
        return { success: true };
    }

    async getLastMessageAndCount(convo: string, id: string): Promise<{ lastMessage: unknown | null; unreadCount: number | null }> {
        const chats = await ChatModel.findOne({ conversation: convo }) as IChat | null;
        let lastMessage: unknown | null = null, unreadCount: number | null = null;
        if (chats) {
            // lastMessage=chats?.content[chats.content.length - 1]
            let lastMessageResult = await ChatModel.aggregate([
                { $match: { conversation: convo.toString() } },
                { $unwind: "$content" },
                {
                    $match:
                    {
                        "content.sendBy": { $ne: id },
                    },
                },
            ]);
            lastMessage = lastMessageResult[lastMessageResult.length - 1] ?? null;
            let unreadCountResult = await ChatModel.aggregate([
                { $match: { conversation: convo.toString() } },
                { $unwind: "$content" },
                {
                    $match:
                    {
                        "content.sendBy": { $ne: id },
                        "content.isRead": false
                    },
                },
            ]);
            unreadCount = unreadCountResult.length;
        }
        return { lastMessage, unreadCount };
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
                            $indexOfArray: ["$content._id", new mongoose.Types.ObjectId(chatId)]
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
        ]) as Array<{ content?: IChatContent[]; _id?: mongoose.Types.ObjectId; conversation?: string; createdAt?: Date }>;

        const contents = (chats[0]?.content ?? []).map((item: IChatContent | Content) => new Content(
            String(item._id),
            Boolean(item.isRead),
            item.sendAt as Date,
            item.sendBy,
            item.time,
            item.date,
            item.message,
            Boolean(item.isScheduleMessage),
            item.callStatus,
            item.duration,
        ));

        const chatDoc = chats[0];
        return new Chat(
            String(chatDoc?._id ?? new mongoose.Types.ObjectId()),
            chatDoc?.conversation ?? "",
            contents,
            chatDoc?.createdAt ?? new Date(),
        );
    }

    async scheduleCall(data: { convoId: string; date: Date; time: string; }, companyId: string): Promise<Chat> {
        const { convoId, date, time } = data;
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
        );
        const newMsg = newMessage as IChat;
        const contents = (newMsg.content ?? []).map((item: IChatContent | Content) => new Content(
            String(item._id),
            Boolean(item.isRead),
            item.sendAt as Date,
            item.sendBy,
            item.time,
            item.date,
            item.message,
            Boolean(item.isScheduleMessage),
            item.callStatus,
            item.duration,
        ));
        return new Chat(
            String(newMessage._id),
            newMessage.conversation,
            contents,
            newMessage.createdAt ?? new Date(),
        );
    }

    async deleteChat(id: string): Promise<{ success: boolean; }> {
        const chatExist = await ChatModel.findOne({ conversation: id });
        if (chatExist) {
            const result = await ChatModel.deleteOne({ conversation: id });
        }
        return { success: true };
    }

    async addAcceptedCallStatus(convoId: string, duration: string): Promise<{ success: boolean; }> {
        const time = new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
        await ChatModel.findOneAndUpdate(
            { conversation: convoId },
            {
                $push: {
                    content: {
                        callStatus: "attended",
                        duration,
                        time
                    }
                }
            },
            {
                upsert: true,
                new: true
            },
        );
        return {success:true};
    }

    async addRejectedCallStatus(convoId: string): Promise<{ success: boolean; }> {
        const time = new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
        await ChatModel.findOneAndUpdate(
            { conversation: convoId },
            {
                $push: {
                    content: {
                        callStatus: "rejected",
                        time
                    }
                }
            },
            {
                upsert: true,
                new: true
            },
        );
        return {success:true};
    }

}