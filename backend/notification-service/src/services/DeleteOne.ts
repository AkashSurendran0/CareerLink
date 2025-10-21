import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { NotificationRepository } from "../repository/NotificationRepository";

@injectable()
export class DeleteOne {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async deleteOne (id:string) {
        const result=await this._notificationRepository.deleteOneNotification(id)
        return result
    }

}