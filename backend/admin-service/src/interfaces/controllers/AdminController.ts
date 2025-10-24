import { Request, Response } from "express";
import { IAdminLogin } from "../../domain/use-cases/IAdminLogin";
import {injectable, inject} from 'inversify'
import { TYPES } from "../../types";
import { STATUS_CODES } from "../../utils/StatusCodes";
import dotenv from 'dotenv'

dotenv.config()

@injectable()
export class AdminController {

    constructor(@inject(TYPES.IAdminLogin) private _adminLogin:IAdminLogin){}

    adminLoginCase = async (req:Request, res:Response):Promise<void> => {
        try {
            console.log('reacheddd')
            const {email, password}=req.body
            const result=await this._adminLogin.findAdmin(email, password)
            console.log(result)
            if(result.success){
                res.cookie("token", result.accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: Number(process.env.MAX_AGE_1_HOUR),
                })
                res.cookie("refreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: Number(process.env.MAX_AGE_1_WEEK),
                })
            }
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}