import mongoose from "mongoose";
import { INotificationRepository } from "../../domain/repository/INotificationRepository";
import { NotificationModel, INotification } from "../models/NotificationModel";
import { Notification } from "../../domain/entities/Notification";

export class NotificationRepository implements INotificationRepository {

    async insertNotification(user: string, content: string, routeTo: string) {
        const data = {
            user,
            content,
            routeTo
        };

        // cast DB result to model interface
        const noti = await NotificationModel.create(data) as INotification;

        return new Notification(
            noti._id?.toString() ?? "",
            String(noti.user),
            String(noti.content),
            String(noti.routeTo ?? ""),
            Boolean(noti.isRead),
            noti.createdAt
        );
    }

    async getAllNotifications(user: string) {
        // return plain objects from mongoose using lean()
        const notifications = await NotificationModel.find({ user }).lean().exec() as unknown as Array<Partial<INotification> & { _id?: mongoose.Types.ObjectId }>;
        return notifications.map((noti) =>
            new Notification(
                noti._id?.toString() ?? "",
                String(noti.user),
                String(noti.content),
                String(noti.routeTo ?? ""),
                Boolean(noti.isRead),
                noti.createdAt
            )
        );
    }

    async deleteAllNotifications(user: string): Promise<{ success: boolean }> {
        await NotificationModel.deleteMany({ user });
        return { success: true };
    }

    async deleteOneNotification(id: string): Promise<{ success: boolean }> {
        const filter: Record<string, unknown> = mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id };
        await NotificationModel.deleteOne(filter);
        return { success: true };
    }

    async markOneAsRead(id: string): Promise<{ success: boolean }> {
        const filter: Record<string, unknown> = mongoose.Types.ObjectId.isValid(id) ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id };
        await NotificationModel.updateOne(
            filter,
            { $set: { isRead: true } }
        );
        return { success: true };
    }

    async markAllRead(user: string): Promise<{ success: boolean }> {
        await NotificationModel.updateMany(
            { user },
            { $set: { isRead: true } }
        );
        return { success: true };
    }

}