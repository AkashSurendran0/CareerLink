import { Request, Response } from "express";
import { STATUS_CODES } from "../../utils/StatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IAlterConnectionRequest, IEvaluateRequest, IGetConnectedUsers, IGetConnectionDetails, IGetConnections, IGetUserRequests, IRemoveConnection } from "../../domain/use-cases/IConnectionUseCase";
import axios from "axios";

@injectable()
export class ConnectionController {

    constructor(
        @inject(TYPES.IAlterConnectionRequest) private _alterConnectionRequest: IAlterConnectionRequest,
        @inject(TYPES.IGetConnections) private _getConnections: IGetConnections,
        @inject(TYPES.IGetUserRequests) private _getUserRequests: IGetUserRequests,
        @inject(TYPES.IEvaluateRequest) private _evaluateRequest: IEvaluateRequest,
        @inject(TYPES.IGetConnectedUsers) private _getConnectedUsers: IGetConnectedUsers,
        @inject(TYPES.IRemoveConnection) private _removeConnection: IRemoveConnection,
        @inject(TYPES.IGetConnectionDetails) private _getConnectionDetails: IGetConnectionDetails
    ) { }

    getUnconnectedUsers = async (req: Request, res: Response) => {
        try {
            const id = req.headers["user-id"] as string;
            const { name } = req.query as { name: string };
            const query = name || undefined;
            const user = await this._getConnections.getUnconnectedUsers(id, query);
            res.json({ user });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    alterConnectionRequest = async (req: Request, res: Response) => {
        try {
            const { user, action } = req.query as { user: string, action: string };
            const id = req.headers["user-id"] as string;
            const result = await this._alterConnectionRequest.alterConnectionRequest(user, id, action);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getUserRequests = async (req: Request, res: Response) => {
        try {
            const id = req.headers["user-id"] as string;
            const { name } = req.query as { name: string };
            const query = name || undefined;
            const result = await this._getUserRequests.getUserRequests(id, query);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    evaluateRequest = async (req: Request, res: Response) => {
        try {
            const id = req.headers["user-id"] as string;
            const { user, action } = req.query as { user: string, action: string };
            const result = await this._evaluateRequest.evaluateRequest(user, id, action);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getConnectedUsers = async (req: Request, res: Response) => {
        try {
            const id = req.headers["user-id"] as string;
            const { name } = req.query as { name: string };
            const query = name || undefined;
            const result = await this._getConnectedUsers.getConnectedUsers(id, query);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    removeConnection = async (req: Request, res: Response) => {
        try {
            const id = req.headers["user-id"] as string;
            const { user } = req.query as { user: string };
            const result = await this._removeConnection.removeConnection(id, user);
            await axios.delete(`http://localhost:5000/chat/v1/deleteConversation?user1=${id}&user2=${user}`);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getConnectionDetails = async (req: Request, res: Response) => {
        try {
            const { user } = req.query as { user: string };
            const id = req.headers["user-id"] as string;
            const result = await this._getConnectionDetails.getConnectionDetails(id, user);
            res.json({ result });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

}