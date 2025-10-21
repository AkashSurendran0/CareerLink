import { Request, Response } from "express"
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { GetAllNotifications } from "../services/GetAllNotifications";
import { MarkAllRead } from "../services/MarkAllRead";
import { DeleteAllNotifications } from "../services/DeleteAllNotifications";
import { DeleteOne } from "../services/DeleteOne";
import { MarkOneRead } from "../services/MarkOneRead";
import { STATUS_CODES } from "../utils/StatusCodes";

@injectable()
export class NotificationController {

    constructor(
        @inject(TYPES.GetAllNotifications) private _getAllNotifications:GetAllNotifications,
        @inject(TYPES.MarkAllRead) private _markAllRead:MarkAllRead,
        @inject(TYPES.DeleteAllNotifications) private _deleteAllNotifications:DeleteAllNotifications,
        @inject(TYPES.DeleteOne) private _deleteOne:DeleteOne,
        @inject(TYPES.MarkOneRead) private _markOneRead:MarkOneRead
    ){}

    getAllNotifications = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const notifications=await this._getAllNotifications.getAllNotifications(user)
            res.json({notifications})
        } catch (error: any) {
            res.status(STATUS_CODES.NOT_FOUND).json({message:error.message});
        }
    }

    markAllRead = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const result=await this._markAllRead.markAllRead(user)
            res.json({result})
        } catch (error: any) {
            res.status(STATUS_CODES.BAD_REQUEST).json({message:error.message});
        }
    }

    deleteAll = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const result=await this._deleteAllNotifications.deleteAllNotifications(user)
            res.json({result}) 
        } catch (error: any) {
            res.status(STATUS_CODES.BAD_REQUEST).json({message:error.message});
        }
    }

    deleteOne = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._deleteOne.deleteOne(id)
            res.json({result}) 
        } catch (error: any) {
            res.status(STATUS_CODES.BAD_REQUEST).json({message:error.message});
        }
    }

    readOne = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._markOneRead.markOneRead(id)
            res.json({result}) 
        } catch (error: any) {
            res.status(STATUS_CODES.BAD_REQUEST).json({message:error.message});
        }
    }

}