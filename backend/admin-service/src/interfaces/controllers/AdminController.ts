import { Request, Response } from "express";
import { IAdminLogin, ICheckAdmin } from "../../domain/use-cases/IAdminLogin";
import {injectable, inject} from 'inversify'
import { TYPES } from "../../types";
import { STATUS_CODES } from "../../utils/StatusCodes";
import dotenv from 'dotenv'

dotenv.config()

@injectable()
export class AdminController {

    constructor(
        @inject(TYPES.IAdminLogin) private _adminLogin:IAdminLogin,
        @inject(TYPES.ICheckAdmin) private _checkAdmin:ICheckAdmin
    ){}

    adminLoginCase = async (req:Request, res:Response):Promise<void> => {
        try {
            const {email, password}=req.body
            const result=await this._adminLogin.findAdmin(email, password)
            if (result && 'accessToken' in result && 'refreshToken' in result) {
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

    checkAdmin = async (req:Request, res:Response) => {
        try {
            const userHeader = req.headers['user-email']
            const user = Array.isArray(userHeader) ? userHeader[0] : (typeof userHeader === 'string' ? userHeader : undefined)
            if(!user){
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'user-email header missing' })
                return
            }
            const result = await this._checkAdmin.checkAdmin(user)
            res.json({ result })
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    adminLogout = async (req:Request, res:Response) => {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            });

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            });

            res.json({success:true});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}