import { NotificationModel } from "../models/NotificationModel";

export class NotificationRepository {

    async insertNotification(user:string, content:string, routeTo:string) {
        const data={
            user,
            content,
            routeTo
        }
        const noti=await NotificationModel.insertOne(data)
        return noti
    }

    async getAllNotifications(user:string) {
        const notification=await NotificationModel.find({user:user})
        return notification
    }

    async deleteAllNotifications(user:string) {
        await NotificationModel.deleteMany({user:user})
        return {success:true}
    }

    async deleteOneNotification(id:string) {
        await NotificationModel.deleteOne({_id:id})
        return {success:true}
    }

    async markOneAsRead (id:string) {
        await NotificationModel.updateOne(
            {_id:id},
            {$set:{
                isRead:true
            }}
        )
        return {success:true}
    }

    async markAllRead (user:string) {
        await NotificationModel.updateMany(
            {user:user},
            {$set:{
                isRead:true
            }}
        )
        return {success:true}
    }

}