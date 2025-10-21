import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { NotificationRepository } from "../repository/NotificationRepository";

@injectable()
export class MarkOneRead {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async markOneRead (id:string) {
        const result=await this._notificationRepository.markOneAsRead(id)
        return result
    }

}