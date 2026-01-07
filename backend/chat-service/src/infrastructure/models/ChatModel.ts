import mongoose, { Document, Schema, Model } from "mongoose";

export interface IChatContent {
    _id?: mongoose.Types.ObjectId;
    sendBy: string;
    isScheduleMessage?: boolean;
    time?: string;
    date?: string;
    message?: string;
    isRead?: boolean;
    sendAt?: Date;
}

export interface IChat extends Document {
    conversation: string;
    content: IChatContent[];
    createdAt?: Date;
    updatedAt?: Date;
}

const chatSchema: Schema<IChat> = new Schema(
    {
        conversation: {
            type: String,
            required: true
        },
        content: [{
            sendBy: {
                type: String,
                required: true
            },
            isScheduleMessage: {
                type: Boolean,
                required: false
            },
            time: {
                type: String,
                required: false
            },
            date: {
                type: String,
                required: false
            },
            message: {
                type: String,
                required: false
            },
            isRead: { type: Boolean, default: false },
            sendAt: { type: Date, default: Date.now }
        }]
    },
    { timestamps: true }
);

export const ChatModel: Model<IChat> = mongoose.model<IChat>("chats", chatSchema);