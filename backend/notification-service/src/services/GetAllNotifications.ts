import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { NotificationRepository } from "../repository/NotificationRepository";

@injectable()
export class GetAllNotifications {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async getAllNotifications(user:string){
        const notifications=await this._notificationRepository.getAllNotifications(user)
        return notifications
    }

}