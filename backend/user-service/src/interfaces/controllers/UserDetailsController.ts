import { Request, Response } from "express";
import { AddUserDetails } from "../../application/use-cases/AddUserDetails";
import { UserDetailsRepository } from "../../infrastructure/repositories/UserDetailsRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export class UserDetailsController {
    private addUserDetails:AddUserDetails

    constructor(){
        const userdetailsRepository=new UserDetailsRepository()
        const userRepository=new UserRepository()
        this.addUserDetails=new AddUserDetails(userdetailsRepository, userRepository)
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

}