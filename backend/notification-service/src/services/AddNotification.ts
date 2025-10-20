import { injectable, inject } from "inversify";
import { NotificationRepository } from "../repository/NotificationRepository";
import { TYPES } from "../types";
import { getIO } from "../utils/Socket";

@injectable()
export class AddNotification {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async saveNotification (user:string, content:string, routeTo:string) {
        const notification=await this._notificationRepository.insertNotification(user, content, routeTo)
        console.log('Notification saved', notification)
        const io=getIO()
        io.to(user).emit('notification', notification)
        return notification
    }

}