import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { uploadImageToS3 } from "../../config/upload";
import { TYPES } from "../../types";
import { IAddCompany } from "../../domain/use-cases/ICompanyUserCase";
import { ICheckCompanyRegistrationInfo } from "../../domain/use-cases/ICompanyUserCase";
import { IGetCompanyDetails } from "../../domain/use-cases/ICompanyUserCase";
import { IEditCompany } from "../../domain/use-cases/ICompanyUserCase";
import { IGetAllCompanies } from "../../domain/use-cases/ICompanyUserCase";
import { IAlterCompanyStatus } from "../../domain/use-cases/ICompanyUserCase";

injectable()
export class CompanyController {

    constructor(
        @inject(TYPES.IAddCompany) private _addCompany:IAddCompany,
        @inject(TYPES.ICheckCompanyRegistrationInfo) private _checkCompanyRegistrationInfo:ICheckCompanyRegistrationInfo,
        @inject(TYPES.IGetCompanyDetails) private _getCompanyDetails:IGetCompanyDetails,
        @inject(TYPES.IEditCompany) private _editCompany:IEditCompany,
        @inject(TYPES.IGetAllCompanies) private _getAllCompanies:IGetAllCompanies,
        @inject(TYPES.IAlterCompanyStatus) private _alterCompanyStatus:IAlterCompanyStatus
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
            const result=await this._checkCompanyRegistrationInfo.checkCompanyRegistrationInfo(userId)
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

    getAllCompanies = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit, query}=req.query;
            const pageNum=parseInt(page as string, 10) || 1;
            const limitNum=parseInt(limit as string, 5) || 5;
            const companies=await this._getAllCompanies.getAllCompanies(pageNum, limitNum, query)
            res.json({companies})
        } catch (error:any) {
            res.status(400).json({message:error.message});
        }
    }

    changeCompanyStatus = async (req:Request, res:Response): Promise<void> => {
        try {
            const company=req.body
            const companies=await this._alterCompanyStatus.changeCompanyStatus(company.id)
            res.json({companies})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

}