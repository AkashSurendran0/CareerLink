import { NotificationDto } from "../dto/NotificationDto";

export class NotificationMapper {
    static toDTO(notification: any): NotificationDto {
        return {
            _id:notification._id,
            user:notification.user,
            content:notification.content,
            routeTo:notification.routeTo,
            isRead:notification.isRead,
            createdAt:notification.createdAt
        }
    }
}