import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { INotificationRepository } from "../domain/repository/INotificationRepository";
import { IDeleteOne } from "../domain/services/INotificationServices";

@injectable()
export class DeleteOne implements IDeleteOne {

    constructor(
        @inject(TYPES.INotificationRepository) private _notificationRepository:INotificationRepository
    ){}

    async deleteOne (id:string): Promise<{success:boolean}> {
        const result=await this._notificationRepository.deleteOneNotification(id);
        return result;
    }

}