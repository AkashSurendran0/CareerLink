import { injectable, inject } from "inversify";
import { NotificationRepository } from "../repository/NotificationRepository";
import { TYPES } from "../TYPES";

@injectable()
export class AddNotification {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async saveNotification (user:string, content:string, routeTo:string) {
        await this._notificationRepository.insertNotification(user, content, routeTo)
        console.log('Notification saved')
    }

}