import { Request, Response } from "express";
import { AddUserDetails } from "../../application/use-cases/AddUserDetails";
import { UserDetailsRepository } from "../../infrastructure/repositories/UserDetailsRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { GetUserDetails } from "../../application/use-cases/GetUserDetails";
import { EditUserDetails } from "../../application/use-cases/EditUserDetails";

export class UserDetailsController {
    private _addUserDetails:AddUserDetails
    private _getUserDetails:GetUserDetails
    private _editUserDetails:EditUserDetails

    constructor(){
        const userdetailsRepository=new UserDetailsRepository()
        const userRepository=new UserRepository()
        this._addUserDetails=new AddUserDetails(userdetailsRepository, userRepository)
        this._getUserDetails=new GetUserDetails(userdetailsRepository, userRepository)
        this._editUserDetails=new EditUserDetails(userdetailsRepository, userRepository)
    }

    insertUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const details=req.body
            const userEmail=req.headers['user-email'] as string
            await this._addUserDetails.addUserDetails(details, userEmail)
            res.json({success:true})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

    queryUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const userEmail=req.headers['user-email'] as string
            const userDetails=await this._getUserDetails.getUserDetails(userEmail)
            res.json({userDetails})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

    modifyUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const userId=req.headers['user-id'] as string
            let imageUrl: string | undefined;
            if (req.file && "path" in req.file) {
                imageUrl = (req.file as any).path;
            }
            const details=req.body
            if(imageUrl){
                details.profilePicture=imageUrl
            }
            await this._editUserDetails.editUserDetails(details, userId)
            res.json({success:true})
        } catch (error: any) {
            res.status(400).json({message:error.message})
        }
    }

}