import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { INotificationRepository } from "../domain/repository/INotificationRepository";
import { IMarkOneRead } from "../domain/services/INotificationServices";

@injectable()
export class MarkOneRead implements IMarkOneRead {

    constructor(
        @inject(TYPES.INotificationRepository) private _notificationRepository:INotificationRepository
    ){}

    async markOneRead (id:string): Promise<{success:boolean}> {
        const result=await this._notificationRepository.markOneAsRead(id)
        return result
    }

}