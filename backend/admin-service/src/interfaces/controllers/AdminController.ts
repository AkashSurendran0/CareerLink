import { Request, Response } from "express";
import { AdminRepository } from "../../infrastructure/database/AdminRepository";
import { AdminLogin } from "../../application/use-cases/AdminLogin";
import {injectable, inject} from 'inversify'
import { TYPES } from "../../types";

@injectable()
export class AdminController {

    constructor(@inject(TYPES.AdminLogin) private _adminLogin:AdminLogin){}

    adminLoginCase = async (req:Request, res:Response):Promise<void> => {
        try {
            console.log('reacheddd')
            const {email, password}=req.body
            const result=await this._adminLogin.findAdmin(email, password)
            console.log(result, 'resulttt')
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

}