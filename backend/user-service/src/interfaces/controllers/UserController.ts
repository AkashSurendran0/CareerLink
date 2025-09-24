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


export class UserController {
    private loginUser:LoginUser
    private signupUser:SignupUser
    private sendOTP:SendOTP
    private changePass:ChangePass
    private sendResetOtp:SendResetOTP
    private getUsers:GetAllUsers
    private alterUserStatus:AlterUserStatus
    private checkUserBlock:CheckUserBlock

    constructor() {
        const userRepository=new UserRepository()
        this.loginUser=new LoginUser(userRepository)
        this.signupUser=new SignupUser(userRepository)
        this.sendOTP=new SendOTP(userRepository)
        this.changePass=new ChangePass(userRepository)
        this.sendResetOtp=new SendResetOTP(userRepository)
        this.getUsers=new GetAllUsers(userRepository)
        this.alterUserStatus=new AlterUserStatus(userRepository)
        this.checkUserBlock=new CheckUserBlock(userRepository)
    }

    login = async (req:Request, res:Response): Promise<void> => {
        try {
            const {email, password}=req.body
            const token=await this.loginUser.execute(email, password)
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({token})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    signup = async (req:Request, res:Response): Promise<void> => {
        try {
            const {username, email, password}=req.body
            const token=await this.signupUser.createUser(username, email, password)
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            console.log(token)
            res.json({token})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    sendOtp = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email}=req.body
            const result=await this.sendOTP.mailOtp(email)
            res.json({result})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    changePassword = async (req:Request, res:Response): Promise<void> =>{
        try {
            const {email, password}=req.body
            const token=await this.changePass.changePass(email, password)
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
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
    }

    getPageUsers = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit}=req.query
            const pageNum=parseInt(page as string, 10) || 1
            const limitNum=parseInt(limit as string, 5) || 5
            const users=await this.getUsers.getUsers(pageNum, limitNum)
            res.json({users})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }

    changeUserStatus = async (req:Request, res:Response): Promise<void> => {
        try {
            const user=req.body
            const users=await this.alterUserStatus.changeUserStatus(user.id)
            res.json({users})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

    checkBlock = async (req:Request, res:Response): Promise<void> => {
        try {
            console.log('heheheheheheh')
            const userId=req.headers['user-id'] as string
            const result=await this.checkUserBlock.checkUserBlock(userId)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }
}