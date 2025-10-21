import { injectable, inject } from "inversify";
import { NotificationRepository } from "../repository/NotificationRepository";
import { TYPES } from "../types";

@injectable()
export class DeleteAllNotifications {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async deleteAllNotifications (user:string) {
        const result=await this._notificationRepository.deleteAllNotifications(user)
        return result
    }

}