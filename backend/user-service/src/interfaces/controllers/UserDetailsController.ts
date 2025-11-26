import { Request, Response } from "express";
import { IAddUserDetails, IGetGithubDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { IGetUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { IEditUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { uploadImageToS3 } from "../../config/upload";
import { STATUS_CODES } from "../../utils/StatusCodes";


@injectable()
export class UserDetailsController {

    constructor(
        @inject(TYPES.IAddUserDetails) private _addUserDetails:IAddUserDetails,
        @inject(TYPES.IGetUserDetails) private _getUserDetails:IGetUserDetails,
        @inject(TYPES.IEditUserDetails) private _editUserDetails:IEditUserDetails,
        @inject(TYPES.IGetGithubDetails) private _getGithubDetails:IGetGithubDetails
    ){}

    insertUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const details=req.body;
            const userEmail=req.headers["user-email"] as string;
            await this._addUserDetails.addUserDetails(details, userEmail);
            res.json({success:true});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    queryUserDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const userEmail=req.headers["user-email"] as string;
            const userDetails=await this._getUserDetails.getUserDetails(userEmail);
            res.json({userDetails}); 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getGithubData = async (req:Request, res:Response) => {
        try {
            const {user}=req.query
            const result=await this._getGithubDetails.getGithubDetails(user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getGithubActivity = async (req:Request, res:Response) => {
        try {
            const {user}=req.query
            const result=await this._getGithubDetails.getGithubRepoDetails(user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}