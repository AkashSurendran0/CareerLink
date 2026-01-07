import { NotificationDto } from "../../dto/NotificationDto";

export interface IAddNotification {
    saveNotification (user:string, content:string, routeTo:string): Promise<NotificationDto>
}

export interface IDeleteAllNotifications {
    deleteAllNotifications (user:string): Promise<{success:boolean}>
}

export interface IDeleteOne {
    deleteOne (id:string): Promise<{success:boolean}>
}

export interface IGetAllNotifications {
    getAllNotifications(user:string): Promise<NotificationDto[]>
}

export interface IMarkAllRead {
    markAllRead (user:string): Promise<{success:boolean}>
}

export interface IMarkOneRead {
    markOneRead (id:string): Promise<{success:boolean}>
}