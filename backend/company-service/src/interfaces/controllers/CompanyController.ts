import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { uploadImageToS3 } from "../../config/upload";
import { TYPES } from "../../types";
import { AddCompany } from "../../application/user-cases/AddCompany";
import { CheckCompanyRegistrationInfo } from "../../application/user-cases/CheckCompanyRegistrationInfo";
import { GetCompanyDetails } from "../../application/user-cases/GetCompanyDetails";
import { EditCompany } from "../../application/user-cases/EditCompany";

injectable()
export class CompanyController {

    constructor(
        @inject(TYPES.AddCompany) private _addCompany:AddCompany,
        @inject(TYPES.CheckCompanyRegistrationInfo) private _checkCompanyRegistrationInfo:CheckCompanyRegistrationInfo,
        @inject(TYPES.GetCompanyDetails) private _getCompanyDetails:GetCompanyDetails,
        @inject(TYPES.EditCompany) private _editCompany:EditCompany
    ){}

    addCompany = async (req:Request, res:Response): Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string
            let imageUrl:string | undefined
            if(req.file){
                imageUrl=await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1])
            }
            const details=req.body
            if(imageUrl){
                details.logo=imageUrl
            }
            await this._addCompany.addCompany(userId, details)
            res.json({success:true})
        } catch (error: any) {  
            res.status(400).json({message:error.message});
        }
    }

    getRegistrationInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string
            const result=await this._checkCompanyRegistrationInfo.CheckCompanyRegistrationInfo(userId)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    getCompanyInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string
            const result=await this._getCompanyDetails.getCompanyDetails(userId)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    editCompany = async  (req:Request, res:Response):Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string
            let imageUrl:string | undefined
            if(req.file){
                imageUrl=await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1])
            }
            const details=req.body
            console.log(details)
            if(imageUrl){
                details.logo=imageUrl
            }
            await this._editCompany.editCompany(userId, details)
            res.json({success:true})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

}