import { Request, Response } from "express";
import { IGetUserNames, ILoginUser } from "../../domain/use-cases/IUserUseCase";
import { ISignupUser } from "../../domain/use-cases/IUserUseCase";
import { ISendOTP } from "../../domain/use-cases/IUserUseCase";
import { IChangePass } from "../../domain/use-cases/IUserUseCase";
import { ISendResetOtp } from "../../domain/use-cases/IUserUseCase";
import { IGetAllUsers } from "../../domain/use-cases/IUserUseCase";
import { IAlterUserStatus } from "../../domain/use-cases/IUserUseCase";
import { ICheckUserBlock } from "../../domain/use-cases/IUserUseCase";
import { IVerifyOTP } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import dotenv from "dotenv";
import { STATUS_CODES } from "../../utils/StatusCodes";

dotenv.config();

@injectable()
export class UserController {

    constructor(
        @inject(TYPES.ILoginUser) private _loginUser:ILoginUser,
        @inject(TYPES.ISignupUser) private _signupUser:ISignupUser,
        @inject(TYPES.ISendOTP) private _sendOTP:ISendOTP,
        @inject(TYPES.IChangePass) private _changePass:IChangePass,
        @inject(TYPES.ISendResetOtp) private _sendResetOtp:ISendResetOtp,
        @inject(TYPES.IGetAllUsers) private _getUsers:IGetAllUsers,
        @inject(TYPES.IAlterUserStatus) private _alterUserStatus:IAlterUserStatus,
        @inject(TYPES.ICheckUserBlock) private _checkUserBlock:ICheckUserBlock,
        @inject(TYPES.IVerifyOTP) private _verifyOtp:IVerifyOTP,
        @inject(TYPES.IGetUserNames) private _getUserNames:IGetUserNames
    ) {}

    login = async (req:Request, res:Response): Promise<void> => {
        try {
            const {email, password}=req.body;
            const result=await this._loginUser.execute(email, password);
            if(result.success){
                res.cookie("token", result.token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: Number(process.env.MAX_AGE_1_HOUR),
                });
                res.cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: Number(process.env.MAX_AGE_1_WEEK),
                });
            }
            res.json({result});
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    signup = async (req:Request, res:Response): Promise<void> => {
        try {
            const {username, email, password}=req.body;
            const token=await this._signupUser.createUser(username, email, password);
            res.cookie("token", token.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: Number(process.env.MAX_AGE_1_HOUR),
            });
            res.cookie("refreshToken", token.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: Number(process.env.MAX_AGE_1_WEEK),
            });
            res.json({token});
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    sendOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body;
            const result=await this._sendOTP.mailOtp(email);
            res.json({result});
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    changePassword = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email, password}=req.body;
            const token=await this._changePass.changePass(email, password);
            res.cookie("token", token.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: Number(process.env.MAX_AGE_1_HOUR),
            });
            res.cookie("refreshToken", token.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: Number(process.env.MAX_AGE_1_WEEK),
            });
            res.json({token});
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    sendPassResetOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body;
            const otp=await this._sendResetOtp.mailOtp(email);
            res.json({otp});
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getPageUsers = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit, query}=req.query;
            const pageNum=parseInt(page as string, 10) || 1;
            const limitNum=parseInt(limit as string, 5) || 5;
            const users=await this._getUsers.getUsers(pageNum, limitNum, query);
            res.json({users});
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    changeUserStatus = async (req:Request, res:Response): Promise<void> => {
        try {
            const user=req.body;
            const users=await this._alterUserStatus.changeUserStatus(user.id);
            res.json({users});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    checkBlock = async (req:Request, res:Response): Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string;
            const result=await this._checkUserBlock.checkUserBlock(userId);
            res.json({result});
        } catch (error: any) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    verifyOTP = async (req:Request, res:Response): Promise<void> => {
        try {
            const {email}=req.query;
            const result=await this._verifyOtp.verifyOtp(email);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const {id}=req.query;
            const result=await this._getUserNames.getUserNames(id);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}