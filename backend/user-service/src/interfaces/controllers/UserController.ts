import { Request, Response } from "express";
import { ILoginUser } from "../../domain/use-cases/IUserUseCase";
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
        @inject(TYPES.IVerifyOTP) private _verifyOtp:IVerifyOTP
    ) {}

    login = async (req:Request, res:Response): Promise<void> => {
        try {
            console.log('here mahn')
            const {email, password}=req.body;
            console.log(2)
            const result=await this._loginUser.execute(email, password);
            console.log(3)
            if(result.success){
                const token=result.token
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            console.log(4)
            res.json({result});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    signup = async (req:Request, res:Response): Promise<void> => {
        try {
            const {username, email, password}=req.body;
            const token=await this._signupUser.createUser(username, email, password);
            res.cookie("token", token.token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            console.log(token);
            res.json({token});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    sendOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body;
            const result=await this._sendOTP.mailOtp(email);
            res.json({result});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    changePassword = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email, password}=req.body;
            const token=await this._changePass.changePass(email, password);
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({token});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    sendPassResetOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body;
            const otp=await this._sendResetOtp.mailOtp(email);
            res.json({otp});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    getPageUsers = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit, query}=req.query;
            const pageNum=parseInt(page as string, 10) || 1;
            const limitNum=parseInt(limit as string, 5) || 5;
            const users=await this._getUsers.getUsers(pageNum, limitNum, query);
            res.json({users});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    changeUserStatus = async (req:Request, res:Response): Promise<void> => {
        try {
            const user=req.body;
            const users=await this._alterUserStatus.changeUserStatus(user.id);
            res.json({users});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

    checkBlock = async (req:Request, res:Response): Promise<void> => {
        try {
            console.log("heheheheheheh");
            const userId=req.headers["user-id"] as string;
            const result=await this._checkUserBlock.checkUserBlock(userId);
            res.json({result});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

    verifyOTP = async (req:Request, res:Response): Promise<void> => {
        try {
            const {email}=req.query;
            const result=await this._verifyOtp.verifyOtp(email);
            res.json({result});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

}