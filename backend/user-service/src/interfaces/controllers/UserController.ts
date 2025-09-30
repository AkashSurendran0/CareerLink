import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/UserRepository";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { SignupUser } from "../../application/use-cases/SignupUser";
import { SendOTP } from "../../application/use-cases/SignupUser";
import { ChangePass } from "../../application/use-cases/ChangePass";
import { SendResetOTP } from "../../application/use-cases/ChangePass";

export class UserController {
    private loginUser:LoginUser
    private signupUser:SignupUser
    private sendOTP:SendOTP
    private changePass:ChangePass
    private sendResetOtp:SendResetOTP

    constructor() {
        const userRepository=new UserRepository()
        this.loginUser=new LoginUser(userRepository)
        this.signupUser=new SignupUser(userRepository)
        this.sendOTP=new SendOTP()
        this.changePass=new ChangePass(userRepository)
        this.sendResetOtp=new SendResetOTP(userRepository)
    }

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
            res.status(400).json({message:error.message})
        }
    }

    signup = async (req:Request, res:Response): Promise<void> => {
        try {
            const {username, email, password}=req.body
            const token=await this.signupUser.createUser(username, email, password)
            console.log(token)
            res.json({token})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    sendOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body
            const otp=await this.sendOTP.mailOtp(email)
            res.json({otp})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    changePassword = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email, password}=req.body
            const token=await this.changePass.changePass(email, password)
            res.json({token})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    sendPassResetOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body
            const otp=await this.sendResetOtp.mailOtp(email)
            res.json({otp})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    };

    getPageUsers = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit}=req.query;
            const pageNum=parseInt(page as string, 10) || 1;
            const limitNum=parseInt(limit as string, 5) || 5;
            const users=await this._getUsers.getUsers(pageNum, limitNum);
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
            console.log(result, 'result')
            res.json({result});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };
}