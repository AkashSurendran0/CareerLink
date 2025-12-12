import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { IGetChats, IGetConversations, ISendMessage, IStartConversation } from "../domain/services/IChatServices";
import axios from "axios";

@injectable()
export class ChatController {

    constructor(
        @inject(TYPES.IStartConversation) private _startConversation:IStartConversation,
        @inject(TYPES.IGetConversations) private _getConversations:IGetConversations,
        @inject(TYPES.ISendMessage) private _sendMessage:ISendMessage,
        @inject(TYPES.IGetChats) private _getChats:IGetChats
    ){}

    startUserConversation = async (req:Request, res:Response) => {
        try {
            const id=req.headers['user-id'] as string
            const {user}=req.query
            const result=await this._startConversation.startConversation(id, user)
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

    sendMessage = async (req:Request, res:Response) => {
        try {
            const {convoId, message}=req.body
            const sender=req.headers['user-id'] as string
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
            const {convo}=req.query
            const result=await this._getChats.getChats(convo)
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