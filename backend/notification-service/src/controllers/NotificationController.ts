import { Request, Response } from "express"
import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IAddNotification, IGetAllNotifications } from "../domain/services/INotificationServices";
import { IMarkAllRead } from "../domain/services/INotificationServices";
import { IDeleteAllNotifications } from "../domain/services/INotificationServices";
import { IDeleteOne } from "../domain/services/INotificationServices";
import { IMarkOneRead } from "../domain/services/INotificationServices";
import { STATUS_CODES } from "../utils/StatusCodes";
import { Mailer } from "../utils/MailHelper";

@injectable()
export class NotificationController {

    constructor(    
        @inject(TYPES.IGetAllNotifications) private _getAllNotifications:IGetAllNotifications,
        @inject(TYPES.IMarkAllRead) private _markAllRead:IMarkAllRead,
        @inject(TYPES.IDeleteAllNotifications) private _deleteAllNotifications:IDeleteAllNotifications,
        @inject(TYPES.IDeleteOne) private _deleteOne:IDeleteOne,
        @inject(TYPES.IMarkOneRead) private _markOneRead:IMarkOneRead,
        @inject(TYPES.IAddNotification) private _addNotification:IAddNotification,
        @inject(TYPES.Mailer) private _mailer:Mailer,
    ){}

    getAllNotifications = async (req:Request, res:Response) => {
        try {
            const userHeader = req.headers['user-email']
            const user = Array.isArray(userHeader) ? userHeader[0] : (typeof userHeader === 'string' ? userHeader : undefined)
            if(!user){
                res.status(STATUS_CODES.BAD_REQUEST).json({message:'user-email header missing'})
                return
            }
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
            const userHeader = req.headers['user-email']
            const user = Array.isArray(userHeader) ? userHeader[0] : (typeof userHeader === 'string' ? userHeader : undefined)
            if(!user){
                res.status(STATUS_CODES.BAD_REQUEST).json({message:'user-email header missing'})
                return
            }
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
            const userHeader = req.headers['user-email']
            const user = Array.isArray(userHeader) ? userHeader[0] : (typeof userHeader === 'string' ? userHeader : undefined)
            if(!user){
                res.status(STATUS_CODES.BAD_REQUEST).json({message:'user-email header missing'})
                return
            }
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
            const idRaw = req.query.id
            const id = Array.isArray(idRaw) ? idRaw[0] : (typeof idRaw === 'string' ? idRaw : undefined)
            if(!id){
                res.status(STATUS_CODES.BAD_REQUEST).json({message:'id is required'})
                return
            }
            const result=await this._deleteOne.deleteOne(String(id))
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
            const idRaw = req.query.id
            const id = Array.isArray(idRaw) ? idRaw[0] : (typeof idRaw === 'string' ? idRaw : undefined)
            if(!id){
                res.status(STATUS_CODES.BAD_REQUEST).json({message:'id is required'})
                return
            }
            const result=await this._markOneRead.markOneRead(String(id))
            res.json({result}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    sendScheduleMail = async (req:Request, res:Response) => {
        try {
            const {userEmail, userName, companyName, date, time}=req.body
            const notiContent='Meeting Scheduled !!'
            await this._addNotification.saveNotification(userEmail, notiContent, '/chats/companyChats')
            await this._mailer.sendMail(userEmail, 'Call Scheduling for Further Proceedings', 
                `Hello ${userName}
Greetings from ${companyName}.

This is to inform you that your call for further proceedings has been scheduled as per the details below:

Date: ${date}
Time: ${time}

Kindly ensure your availability at the scheduled time. In case of any difficulty, please inform us at the earliest.

We look forward to speaking with you.

Best regards,
${companyName}
                `
            )
            res.json({success:true}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    sendRemindMail = async (req:Request, res:Response) => {
        try {
            const {userEmail, userName, companyName, date, time}=req.body
            const notiContent='Meeting Reminder !!'
            await this._addNotification.saveNotification(userEmail, notiContent, '/chats/companyChats')
            await this._mailer.sendMail(userEmail, `Reminder: Scheduled Call on ${date}`, 
                `Dear ${userName},

This is a gentle reminder regarding your scheduled call with ${companyName}.

Date: ${date}
Time: ${time}

Please be available at the mentioned time. Should you face any issues, kindly notify us in advance.

We look forward to the discussion.

Best regards,
${companyName}
                `
            )
            res.json({success:true}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}