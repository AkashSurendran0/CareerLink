import { injectable, inject } from "inversify";
import { INotificationRepository } from "../domain/repository/INotificationRepository";
import { TYPES } from "../types";
import { IDeleteAllNotifications } from "../domain/services/INotificationServices";

@injectable()
export class DeleteAllNotifications implements IDeleteAllNotifications {

    constructor(
        @inject(TYPES.INotificationRepository) private _notificationRepository:INotificationRepository
    ){}

    async deleteAllNotifications (user:string): Promise<{success:boolean}> {
        const result=await this._notificationRepository.deleteAllNotifications(user);
        return result;
    }

}