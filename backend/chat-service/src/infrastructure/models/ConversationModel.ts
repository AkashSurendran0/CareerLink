import mongoose, { Document, Schema, Model } from "mongoose";

export interface IConversation extends Document {
    isCompany?: boolean;
    users: string[];
    createdAt?: Date;
}

const conversationSchema: Schema<IConversation> = new Schema (
    {
        isCompany:{
            type:Boolean
        },
        users:[{
            type:String,
            required:true
        }]
    },
    {timestamps:true}
)

export const ConversationModel: Model<IConversation> = mongoose.model<IConversation>("conversations", conversationSchema)