import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { SignupUser } from "../../application/use-cases/SignupUser";
import { SendOTP } from "../../application/use-cases/SignupUser";
import { ChangePass } from "../../application/use-cases/ChangePass";
import { SendResetOTP } from "../../application/use-cases/ChangePass";
import { GetAllUsers } from "../../application/use-cases/GetUsers";
import { AlterUserStatus } from "../../application/use-cases/AlterUserStatus";
import { CheckUserBlock } from "../../application/use-cases/CheckUserBlock";
import { VerifyOTP } from "../../application/use-cases/VerifyOTP";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";

@injectable()
export class UserController {

    constructor(
        @inject(TYPES.LoginUser) private _loginUser:LoginUser,
        @inject(TYPES.SignupUser) private _signupUser:SignupUser,
        @inject(TYPES.SendOTP) private _sendOTP:SendOTP,
        @inject(TYPES.ChangePass) private _changePass:ChangePass,
        @inject(TYPES.SendResetOTP) private _sendResetOtp:SendResetOTP,
        @inject(TYPES.GetAllUsers) private _getUsers:GetAllUsers,
        @inject(TYPES.AlterUserStatus) private _alterUserStatus:AlterUserStatus,
        @inject(TYPES.CheckUserBlock) private _checkUserBlock:CheckUserBlock,
        @inject(TYPES.VerifyOTP) private _verifyOtp:VerifyOTP
    ) {}

    login = async (req:Request, res:Response): Promise<void> => {
        try {
            const {email, password}=req.body;
            const result=await this._loginUser.execute(email, password);
            if(result.success){
                const token=result.token
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            res.json({result});
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    };

    signup = async (req:Request, res:Response): Promise<void> => {
        try {
            const {username, email, password}=req.body;
            const token=await this._signupUser.createUser(username, email, password);
            res.cookie("token", token, {
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
    }

}