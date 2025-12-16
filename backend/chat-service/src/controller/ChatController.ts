import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { IGetChats, IGetConversations, IReadMessages, ISendMessage, IStartConversation } from "../domain/services/IChatServices";
import axios from "axios";

@injectable()
export class ChatController {

    constructor(
        @inject(TYPES.IStartConversation) private _startConversation:IStartConversation,
        @inject(TYPES.IGetConversations) private _getConversations:IGetConversations,
        @inject(TYPES.ISendMessage) private _sendMessage:ISendMessage,
        @inject(TYPES.IGetChats) private _getChats:IGetChats,
        @inject(TYPES.IReadMessages) private _readMessages:IReadMessages
    ){}

    startUserConversation = async (req:Request, res:Response) => {
        try {
            const {company}=req.query
            const id=req.headers['user-id'] as string
            let sender = company || id
            let isCompany=company ? true:false
            const {user}=req.query
            const result=await this._startConversation.startConversation(sender, user, isCompany)
            res.json({result})
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            } 
        }
    } 

    getConversations = async (req:Request, res:Response) => {
        try {
            const id=req.headers['user-id'] as string
            let result=await this._getConversations.getConversations(id)
            for(let i=0;i<result.length;i++){
                if(result[i].isCompany){
                    const companyDetails=await axios.get(`http://localhost:5000/company/v1/getCompanyDetailsByQuery?id=${result[i].user}`)
                    result[i].username=companyDetails.data.result.name
                    result[i].pfp=companyDetails.data.result.logo
                }else{
                    const userDetails=await axios.get(`http://localhost:5000/user/v1/getDetailsByQuery?id=${result[i].user}`)
                    result[i].username=userDetails.data.result.result.username
                    result[i].pfp=userDetails.data.result?.pfp || null
                }
            }
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            } 
        }
    }

    sendMessage = async (req:Request, res:Response) => {
        try {
            const {convoId, message}=req.body
            const id=req.headers['user-id'] as string
            const {company}=req.query
            let sender;
            if(company==='undefined') sender=id
            else sender = company || id
            const result=await this._sendMessage.sendMessage(sender, message, convoId)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            } 
        }
    }

    getChats = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            const {convo}=req.query
            const result=await this._getChats.getChats(convo, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            } 
        }
    }

    readMessages = async (req:Request, res:Response) => {
        try {
            const {convo, user}=req.query
            const result=await this._readMessages.readMessages(convo, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getCompanyConversations = async (req:Request, res:Response) => {
        try {
            const {company}=req.query
            console.log(company)
            let result=await this._getConversations.getConversations(company)
            for(let i=0;i<result.length;i++){
                const userDetails=await axios.get(`http://localhost:5000/user/v1/getDetailsByQuery?id=${result[i].user}`)
                result[i].username=userDetails.data.result.result.username
                result[i].pfp=userDetails.data.result?.pfp || null
            }
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}