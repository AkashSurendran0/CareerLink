import mongoose, {Document, Schema, Model, mongo} from "mongoose";

export interface IChat extends Document {
    conversation:string,
    content:[{
        sendBy:string,
        message:string,
        isRead:boolean,
        sendAt:Date
    }]
}

const chatSchema: Schema<IChat>=new Schema (
    {
        conversation:{
            type:String,
            required:true
        },
        content:[{
            sendBy:{
                type:String,
                required:true
            },
            message:{
                type:String,
                required:true
            },
            isRead:{
                type:Boolean,
                default:false
            },
            sendAt:{
                type:Date,
                default:Date.now()
            }
        }]
    },
    {timestamps:true}
)

export const ChatModel: Model<IChat> = mongoose.model<IChat>('chats', chatSchema)