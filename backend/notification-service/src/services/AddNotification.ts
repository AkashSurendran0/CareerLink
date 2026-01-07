import { injectable, inject } from "inversify";
import { INotificationRepository } from "../domain/repository/INotificationRepository";
import { TYPES } from "../types";
import { getIO } from "../utils/Socket";
import { NotificationDto } from "../dto/NotificationDto";
import { NotificationMapper } from "../mapper/NotificationMapper";
import { IAddNotification } from "../domain/services/INotificationServices";
import { logger } from "../utils/logger";

@injectable()
export class AddNotification implements IAddNotification {

    constructor(
        @inject(TYPES.INotificationRepository) private _notificationRepository:INotificationRepository
    ){}

    async saveNotification (user:string, content:string, routeTo:string): Promise<NotificationDto> {
        const notification=await this._notificationRepository.insertNotification(user, content, routeTo);
        logger.info("Notification saved");
        const io=getIO();
        io.to(user).emit("notification", notification);
        return NotificationMapper.toDTO(notification);
    }

}