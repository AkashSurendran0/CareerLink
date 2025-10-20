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

}