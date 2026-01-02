import { NotificationDto } from "../dto/NotificationDto";
import { Notification } from "../domain/entities/Notification";

export class NotificationMapper {
    static toDTO(notification: Notification): NotificationDto {
        return {
            _id: notification._id,
            user: notification.user,
            content: notification.content,
            routeTo: notification.routeTo,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        }
    }
}