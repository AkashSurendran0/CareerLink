import { Request, Response } from "express";
import { AddUserDetails } from "../../application/use-cases/AddUserDetails";
import { GetUserDetails } from "../../application/use-cases/GetUserDetails";
import { EditUserDetails } from "../../application/use-cases/EditUserDetails";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { uploadImageToS3 } from "../../config/upload";

@injectable()
export class UserDetailsController {

    constructor(
        @inject(TYPES.AddUserDetails) private _addUserDetails:AddUserDetails,
        @inject(TYPES.GetUserDetails) private _getUserDetails:GetUserDetails,
        @inject(TYPES.EditUserDetails) private _editUserDetails:EditUserDetails,
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
            const userEmail=req.headers["user-email"] as string;
            const userDetails=await this._getUserDetails.getUserDetails(userEmail);
            res.json({userDetails});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

    modifyUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string;
            let imageUrl: string | undefined;
            let url;
            if (req.file && "path" in req.file) {
                url = await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1]);
            }
            const details=req.body;
            if(imageUrl){
                details.profilePicture=url;
            }
            await this._editUserDetails.editUserDetails(details, userId);
            res.json({success:true});
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    };

}