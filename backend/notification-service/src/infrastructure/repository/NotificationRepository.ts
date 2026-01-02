import mongoose from 'mongoose';
import { INotificationRepository } from "../../domain/repository/INotificationRepository";
import { NotificationModel } from "../models/NotificationModel";
import { Notification } from "../../domain/entities/Notification";

export class NotificationRepository implements INotificationRepository {

    async insertNotification(user:string, content:string, routeTo:string) {
        const data = {
            user,
            content,
            routeTo
        }

        // using any at DB boundary
        const noti: any = await NotificationModel.create(data)

        return new Notification(
            noti._id?.toString(),
            noti.user,
            noti.content,
            String(noti.routeTo ?? ''),
            Boolean(noti.isRead),
            noti.createdAt
        )
    }

    async getAllNotifications(user:string) {
        // return plain objects from mongoose using lean()
        const notifications: any[] = await NotificationModel.find({user}).lean().exec()
        return notifications.map((noti: any) =>
            new Notification(
                noti._id?.toString(),
                noti.user,
                noti.content,
                String(noti.routeTo ?? ''),
                Boolean(noti.isRead),
                noti.createdAt
            )
        )
    }

    async deleteAllNotifications(user:string): Promise<{success:boolean}> {
        await NotificationModel.deleteMany({user})
        return {success:true}
    }

    async deleteOneNotification(id:string): Promise<{success:boolean}> {
        const filter: any = mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id }
        await NotificationModel.deleteOne(filter)
        return {success:true}
    }

    async markOneAsRead (id:string): Promise<{success:boolean}> {
        const filter: any = mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id }
        await NotificationModel.updateOne(
            filter,
            { $set: { isRead:true } }
        )
        return {success:true}
    }

    async markAllRead (user:string): Promise<{success:boolean}> {
        await NotificationModel.updateMany(
            { user },
            { $set: { isRead:true } }
        )
        return {success:true}
    }

}