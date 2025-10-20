import { Request, Response } from "express"
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { GetAllNotifications } from "../services/GetAllNotifications";
import { MarkAllRead } from "../services/MarkAllRead";

@injectable()
export class NotificationController {

    constructor(
        @inject(TYPES.GetAllNotifications) private _getAllNotifications:GetAllNotifications,
        @inject(TYPES.MarkAllRead) private _markAllRead:MarkAllRead
    ){}

    getAllNotifications = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const notifications=await this._getAllNotifications.getAllNotifications(user)
            res.json({notifications})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    markAllRead = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            await this._markAllRead.markAllRead(user)
            console.log()
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

}