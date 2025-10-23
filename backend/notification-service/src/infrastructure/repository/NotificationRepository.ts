import { INotificationRepository } from "../../domain/repository/INotificationRepository";
import { NotificationModel } from "../models/NotificationModel";
import { Notification } from "../../domain/entities/Notification";

export class NotificationRepository implements INotificationRepository {

    async insertNotification(user:string, content:string, routeTo:string) {
        const data={
            user,
            content,
            routeTo
        }
        const noti=await NotificationModel.insertOne(data)
        return new Notification(
            noti._id,
            noti.user,
            noti.content,
            noti.routeTo,
            noti.isRead,
            noti.createdAt
        )
    }

    async getAllNotifications(user:string) {
        const notification=await NotificationModel.find({user:user})
        console.log('noti', notification)
        return notification.map((noti: any)=>
            new Notification(
                noti._id,
                noti.user,
                noti.content,
                noti.routeTo,
                noti.isRead,
                noti.createdAt
            )
        )
    }

    async deleteAllNotifications(user:string): Promise<{success:boolean}> {
        await NotificationModel.deleteMany({user:user})
        return {success:true}
    }

    async deleteOneNotification(id:string): Promise<{success:boolean}> {
        await NotificationModel.deleteOne({_id:id})
        return {success:true}
    }

    async markOneAsRead (id:string): Promise<{success:boolean}> {
        console.log(55)
        await NotificationModel.updateOne(
            {_id:id},
            {$set:{
                isRead:true
            }}
        )
        console.log(66)
        return {success:true}
    }

    async markAllRead (user:string): Promise<{success:boolean}> {
        await NotificationModel.updateMany(
            {user:user},
            {$set:{
                isRead:true
            }}
        )
        return {success:true}
    }

}