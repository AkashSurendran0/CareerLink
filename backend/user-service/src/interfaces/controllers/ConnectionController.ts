import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ISendConnectionRequest } from "../../domain/use-cases/IUserUseCase";

@injectable()
export class ConnectionController {

    constructor(
        @inject(TYPES.ISendConnectionRequest) private _sendConnectionRequest:ISendConnectionRequest
    ) {}

    sendConnectionRequest = async (req:Request, res:Response) => {
        try {
            const {user}=req.query;
            const id=req.headers["user-id"] as string;
            const result=await this._sendConnectionRequest.sendConnection(user, id);
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