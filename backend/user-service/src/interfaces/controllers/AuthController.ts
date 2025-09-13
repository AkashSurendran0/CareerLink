import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/UserRepository";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { SignupUser } from "../../application/use-cases/SignupUser";

export class AuthController {
    private loginUser:LoginUser
    private signupUser:SignupUser

    constructor() {
        const userRepository=new UserRepository()
        this.loginUser=new LoginUser(userRepository)
        this.signupUser=new SignupUser(userRepository)
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
            res.json({token})
        } catch (error:any) {
            res.status(400).json({message:error.message})
        }
    }
}