import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { INotificationRepository } from "../domain/repository/INotificationRepository";
import { NotificationDto } from "../dto/NotificationDto";
import { NotificationMapper } from "../mapper/NotificationMapper";
import { IGetAllNotifications } from "../domain/services/INotificationServices";

@injectable()
export class GetAllNotifications implements IGetAllNotifications {

    constructor(
        @inject(TYPES.INotificationRepository) private _notificationRepository:INotificationRepository
    ){}

    async getAllNotifications(user:string): Promise<NotificationDto[]>{
        const notifications=await this._notificationRepository.getAllNotifications(user);
        const noti=notifications.map(noti=>NotificationMapper.toDTO(noti));
        return noti;
    }

}