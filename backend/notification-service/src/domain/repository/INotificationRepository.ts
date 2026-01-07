import { Notification } from "../entities/Notification";

export interface INotificationRepository {
    insertNotification(user:string, content:string, routeTo:string): Promise<Notification>,
    getAllNotifications(user:string): Promise<Notification[]>,
    deleteAllNotifications(user:string): Promise<{success:boolean}>,
    deleteOneNotification(id:string): Promise<{success:boolean}>,
    markOneAsRead (id:string): Promise<{success:boolean}>,
    markAllRead (user:string): Promise<{success:boolean}>
}