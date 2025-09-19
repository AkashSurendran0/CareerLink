import { Request, Response } from "express";
import { AdminRepository } from "../../infrastructure/database/AdminRepository";
import { AdminLogin } from "../../application/use-cases/AdminLogin";

export class AdminController {
    private adminLogin:AdminLogin

    constructor(){
        const adminRepository=new AdminRepository()
        this.adminLogin=new AdminLogin(adminRepository)
    }

    adminLoginCase = async (req:Request, res:Response):Promise<void> => {
        try {
            console.log('reacheddd')
            const {email, password}=req.body
            const result=await this.adminLogin.findAdmin(email, password)
            console.log(result, 'resulttt')
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

}