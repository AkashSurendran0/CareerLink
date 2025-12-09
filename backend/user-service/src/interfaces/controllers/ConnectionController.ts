import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAlterConnectionRequest, IEvaluateRequest, IGetConnections, IGetUserRequests } from "../../domain/use-cases/IConnectionUseCase";

@injectable()
export class ConnectionController {

    constructor(
        @inject(TYPES.IAlterConnectionRequest) private _alterConnectionRequest:IAlterConnectionRequest,
        @inject(TYPES.IGetConnections) private _getConnections:IGetConnections,
        @inject(TYPES.IGetUserRequests) private _getUserRequests:IGetUserRequests,
        @inject(TYPES.IEvaluateRequest) private _evaluateRequest:IEvaluateRequest
    ) {}

    getUnconnectedUsers = async (req:Request, res:Response) => {
        try {
            const id=req.headers['user-id'] as string
            const user=await this._getConnections.getUnconnectedUsers(id)
            res.json({user})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    alterConnectionRequest = async (req:Request, res:Response) => {
        try {
            const {user, action}=req.query;
            const id=req.headers["user-id"] as string;
            const result=await this._alterConnectionRequest.alterConnectionRequest(user, id, action);
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getUserRequests = async (req:Request, res:Response) => {
        try {
            const id=req.headers["user-id"] as string;
            const result=await this._getUserRequests.getUserRequests(id);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    evaluateRequest = async (req:Request, res:Response) => {
        try {
            const id=req.headers["user-id"] as string;
            const {user, action}=req.query;
            const result=await this._evaluateRequest.evaluateRequest(user, id, action);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

}