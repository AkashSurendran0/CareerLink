import { injectable, inject } from "inversify";
import { INotificationRepository } from "../domain/repository/INotificationRepository";
import { TYPES } from "../types";
import { IMarkAllRead } from "../domain/services/INotificationServices";

@injectable()
export class MarkAllRead implements IMarkAllRead {

    constructor(
        @inject(TYPES.INotificationRepository) private _notificationRepository:INotificationRepository
    ){}

    async markAllRead (user:string): Promise<{success:boolean}> {
        const result=await this._notificationRepository.markAllRead(user);
        return result;
    }

}