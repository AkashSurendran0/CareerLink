import { Request, Response } from "express"
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IGetAllNotifications } from "../domain/services/INotificationServices";
import { IMarkAllRead } from "../domain/services/INotificationServices";
import { IDeleteAllNotifications } from "../domain/services/INotificationServices";
import { IDeleteOne } from "../domain/services/INotificationServices";
import { IMarkOneRead } from "../domain/services/INotificationServices";
import { STATUS_CODES } from "../utils/StatusCodes";

@injectable()
export class NotificationController {

    constructor(    
        @inject(TYPES.IGetAllNotifications) private _getAllNotifications:IGetAllNotifications,
        @inject(TYPES.IMarkAllRead) private _markAllRead:IMarkAllRead,
        @inject(TYPES.IDeleteAllNotifications) private _deleteAllNotifications:IDeleteAllNotifications,
        @inject(TYPES.IDeleteOne) private _deleteOne:IDeleteOne,
        @inject(TYPES.IMarkOneRead) private _markOneRead:IMarkOneRead
    ){}

    getAllNotifications = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const notifications=await this._getAllNotifications.getAllNotifications(user)
            res.json({notifications}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            } 
        }
    }

    markAllRead = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const result=await this._markAllRead.markAllRead(user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    deleteAll = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const result=await this._deleteAllNotifications.deleteAllNotifications(user)
            res.json({result}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    deleteOne = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._deleteOne.deleteOne(id)
            res.json({result}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    readOne = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._markOneRead.markOneRead(id)
            res.json({result}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}