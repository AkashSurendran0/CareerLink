import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { IStartConversation } from "../domain/services/IChatServices";

@injectable()
export class ChatController {

    constructor(
        @inject(TYPES.IStartConversation) private _startConversation:IStartConversation
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

}