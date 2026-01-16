import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { IAddAcceptedCallStatus, IAddRejectedCallStatus, IDeleteConversation, IGetChats, IGetConversations, IGetReportedMessage, IReadMessages, IScheduleCall, ISendMessage, IStartConversation } from "../domain/services/IChatServices";
import axios from "axios";
import dotenv from "dotenv";
import { uploadPost } from "../config/upload";

dotenv.config();

@injectable()
export class ChatController {

    constructor(
        @inject(TYPES.IStartConversation) private _startConversation: IStartConversation,
        @inject(TYPES.IGetConversations) private _getConversations: IGetConversations,
        @inject(TYPES.ISendMessage) private _sendMessage: ISendMessage,
        @inject(TYPES.IGetChats) private _getChats: IGetChats,
        @inject(TYPES.IReadMessages) private _readMessages: IReadMessages,
        @inject(TYPES.IGetReportedMessage) private _getReportedMessages: IGetReportedMessage,
        @inject(TYPES.IScheduleCall) private _scheduleCall: IScheduleCall,
        @inject(TYPES.IDeleteConversation) private _deleteConversation: IDeleteConversation,
        @inject(TYPES.IAddAcceptedCallStatus) private _addAcceptedCallStatus: IAddAcceptedCallStatus,
        @inject(TYPES.IAddRejectedCallStatus) private _addRejectedCallStatus: IAddRejectedCallStatus
    ) { }

    startUserConversation = async (req: Request, res: Response) => {
        try {
            const { company } = req.query as { company: string };
            const id = req.headers["user-id"] as string;
            let sender = company || id;
            let isCompany = company ? true : false;
            const { user } = req.query as { user: string };
            const result = await this._startConversation.startConversation(sender, user, isCompany);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getConversations = async (req: Request, res: Response) => {
        try {
            const id = req.headers["user-id"] as string;
            let result = await this._getConversations.getConversations(id);
            for (let i = 0; i < result.length; i++) {
                if (result[i]!.isCompany) {
                    const companyDetails = await axios.get(`${process.env.API_GATEWAY_ROUTE}/company/v1/getCompanyDetailsByQuery?id=${result[i]!.users}`);
                    // @ts-ignore
                    result[i].username = companyDetails.data.result.name;
                    // @ts-ignore
                    result[i].pfp = companyDetails.data.result.logo;
                } else {
                    const userDetails = await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result[i]!.users}`);
                    // @ts-ignore
                    result[i].email = userDetails.data.result.result.email;
                    // @ts-ignore
                    result[i].username = userDetails.data.result.result.username;
                    // @ts-ignore
                    result[i].pfp = userDetails.data.result?.pfp || null;
                }
            }
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    sendMessage = async (req: Request, res: Response) => {
        try {
            const { convoId, message } = req.body;
            let url=null;
            if(req.file){
                const buffer=req.file?.buffer;
                if (!buffer) {
                    res.status(STATUS_CODES.BAD_REQUEST).json({ message: "File buffer is required" });
                    return;
                }
                const fileType=req.file.mimetype.split("/")[1];
                if (!fileType) {
                    res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid file type" });
                    return;
                }
                url=await uploadPost(buffer, fileType);
            }  
            const id = req.headers["user-id"] as string;
            const { company } = req.query as { company: string };
            let sender;
            if (company === "undefined") sender = id;
            else sender = company || id;
            const result = await this._sendMessage.sendMessage(sender, message, convoId, url);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getChats = async (req: Request, res: Response) => {
        try {
            const user = req.headers["user-id"] as string;
            const { convo } = req.query as { convo: string };
            const result = await this._getChats.getChats(convo, user);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    readMessages = async (req: Request, res: Response) => {
        try {
            const { convo, user } = req.query as { convo: string, user: string };
            const result = await this._readMessages.readMessages(convo, user);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getCompanyConversations = async (req: Request, res: Response) => {
        try {
            const { company } = req.query as { company: string };
            console.log(company);
            let result = await this._getConversations.getConversations(company);
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                const userDetails = await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result[i]!.users}`);
                // @ts-ignore
                result[i].email = userDetails.data.result.result.email;
                // @ts-ignore
                result[i].username = userDetails.data.result.result.username;
                // @ts-ignore
                result[i].pfp = userDetails.data.result?.pfp || null;
            }
            console.log(result);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getReportedMessage = async (req: Request, res: Response) => {
        try {
            const { user1, user2, chatId } = req.query as { user1: string, user2: string, chatId: string };
            const result = await this._getReportedMessages.getReportedMessage(user1, user2, chatId);
            res.json(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    deleteConversation = async (req: Request, res: Response) => {
        try {
            const { user1, user2 } = req.query as { user1: string, user2: string };
            const result = await this._deleteConversation.deleteConversation(user1, user2);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    scheduleCall = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const { company } = req.query as { company: string };
            const result = await this._scheduleCall.scheduleCall(data, company);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    addAcceptedCallStatus = async (req:Request, res:Response) => {
        try {
            const {convo, duration}=req.query as {convo:string, duration:string};
            console.log(convo, duration);
            const result=await this._addAcceptedCallStatus.addAcceptedCallStatus(convo, duration);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    addRejectCallStatus = async (req:Request, res:Response) => {
        try {
            const {convo} = req.query as {convo:string};  
            const result=await  this._addRejectedCallStatus.addRejectCallStatus(convo);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

}