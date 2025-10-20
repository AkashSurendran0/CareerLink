import { injectable, inject } from "inversify";
import { NotificationRepository } from "../repository/NotificationRepository";
import { TYPES } from "../types";

@injectable()
export class MarkAllRead {

    constructor(
        @inject(TYPES.NotificationRepository) private _notificationRepository:NotificationRepository
    ){}

    async markAllRead (user:string) {
        
    }

}