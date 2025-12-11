import mongoose, {Document, Schema, Model, mongo} from "mongoose";

export interface IConversation extends Document {
    users: string[]
    createdAt: Date
}

const conversationSchema: Schema<IConversation>=new Schema (
    {
        users:[{
            type:String,
            required:true
        }]
    },
    {timestamps:true}
)

export const ConversationModel: Model<IConversation> = mongoose.model<IConversation>("conversations", conversationSchema)