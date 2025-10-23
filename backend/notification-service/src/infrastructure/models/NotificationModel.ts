import mongoose, {Document, Schema, Model, mongo} from "mongoose";

export interface INotification extends Document {
    user:string,
    content:string,
    routeTo:string,
    isRead:boolean,
    createdAt:Date
}

const notificationSchema: Schema<INotification>=new Schema (
    {
        user:{
            type:String,
            required:true
        },
        content:{
            type:String,
            required:true
        },
        routeTo:{
            type:String,
            required:false
        },
        isRead:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
)

export const NotificationModel: Model<INotification> = mongoose.model<INotification>("Notification", notificationSchema)