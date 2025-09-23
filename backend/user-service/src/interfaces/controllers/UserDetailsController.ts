import { Request, Response } from "express";
import { AddUserDetails } from "../../application/use-cases/AddUserDetails";
import { UserDetailsRepository } from "../../infrastructure/repositories/UserDetailsRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetUserDetails } from "../../application/use-cases/GetUserDetails";

export class UserDetailsController {
    private addUserDetails:AddUserDetails
    private getUserDetails:GetUserDetails

    constructor(){
        const userdetailsRepository=new UserDetailsRepository()
        const userRepository=new UserRepository()
        this.addUserDetails=new AddUserDetails(userdetailsRepository, userRepository)
        this.getUserDetails=new GetUserDetails(userdetailsRepository, userRepository)
    }

    insertUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const details=req.body
            const userEmail=req.headers['user-email'] as string
            await this.addUserDetails.addUserDetails(details, userEmail)
            res.json({success:true})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

    queryUserDetails = async (req:Request, res:Response) => {
        try {
            const userEmail=req.headers['user-email'] as string
            const userDetails=await this.getUserDetails.getUserDetails(userEmail)
            res.json({userDetails})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

}