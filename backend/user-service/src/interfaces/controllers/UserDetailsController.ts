import { Request, Response } from "express";
import { IAddUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { IGetUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { IEditUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { uploadImageToS3 } from "../../config/upload";


@injectable()
export class UserDetailsController {

    constructor(
        @inject(TYPES.IAddUserDetails) private _addUserDetails:IAddUserDetails,
        @inject(TYPES.IGetUserDetails) private _getUserDetails:IGetUserDetails,
        @inject(TYPES.IEditUserDetails) private _editUserDetails:IEditUserDetails,
    ){}

    insertUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const details=req.body;
            const userEmail=req.headers["user-email"] as string;
            await this._addUserDetails.addUserDetails(details, userEmail);
            res.json({success:true});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

    queryUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            console.log(1)
            const userEmail=req.headers["user-email"] as string;
            console.log(2, userEmail)
            const userDetails=await this._getUserDetails.getUserDetails(userEmail);
            console.log(3)
            res.json({userDetails});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

    modifyUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string;
            let imageUrl: string | undefined;
            if (req.file) {
                imageUrl = await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1]);
            }
            const details=req.body;
            if(imageUrl){
                details.profilePicture=imageUrl;
            }
            await this._editUserDetails.editUserDetails(details, userId);
            res.json({success:true});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

}