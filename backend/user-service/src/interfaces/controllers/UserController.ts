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
            const {email, password}=req.body
            const token=await this.loginUser.execute(email, password)
            res.json({token})
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
    }
}