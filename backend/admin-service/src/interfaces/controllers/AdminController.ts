import { Request, Response } from "express";
import { AdminRepository } from "../../infrastructure/database/AdminRepository";
import { IAdminLogin } from "../../domain/use-cases/IAdminLogin";
import {injectable, inject} from 'inversify'
import { TYPES } from "../../types";

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
                res.cookie("adminToken", result.accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000,
                })
                res.cookie("adminRefreshToken", result.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
            }
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

}