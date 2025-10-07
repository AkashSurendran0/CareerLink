import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { uploadImageToS3 } from "../../config/upload";
import { TYPES } from "../../types";
import { AddCompany } from "../../application/user-cases/AddCompany";
import { CheckCompanyRegistrationInfo } from "../../application/user-cases/CheckCompanyRegistrationInfo";

injectable()
export class CompanyController {

    constructor(
        @inject(TYPES.AddCompany) private _addCompany:AddCompany,
        @inject(TYPES.CheckCompanyRegistrationInfo) private _checkCompanyRegistrationInfo:CheckCompanyRegistrationInfo
    ){}

    addCompany = async (req:Request, res:Response): Promise<void> => {
        try {
            const userId=req.headers["user-id"] as string
            let imageUrl:string | undefined
            if(req.file){
                imageUrl=await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1])
            }
            console.log(2)
            const details=req.body
            if(imageUrl){
                details.logo=imageUrl
            }
            console.log(3)
            await this._addCompany.addCompany(userId, details)
            console.log(4)
            res.json({success:true})
        } catch (error: any) {  
            res.status(400).json({message:error.message});
        }
    }

    getRegistrationInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            console.log(1)
            const userId=req.headers["user-id"] as string
            console.log(userId)
            const result=await this._checkCompanyRegistrationInfo.CheckCompanyRegistrationInfo(userId)
            console.log(2)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

}