import { NotificationModel } from "../models/NotificationModel";

export class NotificationRepository {

    async insertNotification(user:string, content:string, routeTo:string) {
        const data={
            user,
            content,
            routeTo
        }
        await NotificationModel.insertOne(data)
        return {success:true}
    }

}