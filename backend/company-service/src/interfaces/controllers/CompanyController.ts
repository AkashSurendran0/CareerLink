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
import { ICheckCompanyDetails } from "../../domain/use-cases/ICompanyUserCase";
import { IAlterCompanyRegistrationStatus } from "../../domain/use-cases/ICompanyUserCase";
import { IReapplyCompany } from "../../domain/use-cases/ICompanyUserCase";
import { IDeleteCompany } from "../../domain/use-cases/ICompanyUserCase";

injectable()
export class CompanyController {

    constructor(
        @inject(TYPES.IAddCompany) private _addCompany:IAddCompany,
        @inject(TYPES.ICheckCompanyRegistrationInfo) private _checkCompanyRegistrationInfo:ICheckCompanyRegistrationInfo,
        @inject(TYPES.IGetCompanyDetails) private _getCompanyDetails:IGetCompanyDetails,
        @inject(TYPES.IEditCompany) private _editCompany:IEditCompany,
        @inject(TYPES.IGetAllCompanies) private _getAllCompanies:IGetAllCompanies,
        @inject(TYPES.IAlterCompanyStatus) private _alterCompanyStatus:IAlterCompanyStatus,
        @inject(TYPES.ICheckCompanyDetails) private _checkCompanyDetails:ICheckCompanyDetails,
        @inject(TYPES.IAlterCompanyRegistrationStatus) private _alterCompanyRegistrationStatus:IAlterCompanyRegistrationStatus,
        @inject(TYPES.IReapplyCompany) private _reapplyCompany:IReapplyCompany,
        @inject(TYPES.IDeleteCompany) private _deleteCompany:IDeleteCompany
    ){}

    addCompany = async (req:Request, res:Response): Promise<void> => {
        try {
            const user=req.headers["user-email"] as string
            let imageUrl:string | undefined
            if(req.file){
                imageUrl=await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1])
            }
            const details=req.body
            if(imageUrl){
                details.logo=imageUrl
            }
            await this._addCompany.addCompany(user, details)
            res.json({success:true})
        } catch (error: any) {  
            res.status(400).json({message:error.message});
        }
    }

    getRegistrationInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            const user=req.headers["user-email"] as string
            const result=await this._checkCompanyRegistrationInfo.checkCompanyRegistrationInfo(user)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    getCompanyInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            const user=req.headers["user-email"] as string
            const result=await this._getCompanyDetails.getCompanyDetails(user)
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

    checkCompanyDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const {id}=req.query
            const company=await this._checkCompanyDetails.getCompanyInfo(id)
            res.json({company})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    alterCompanyRegistrationStatus = async (req:Request, res:Response): Promise<void> => {
        try {
            const {code, id}=req.query
            const num=parseInt(code as string)
            const result=await this._alterCompanyRegistrationStatus.alterCompanyRegistrationStatus(num, id)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    reapplyCompany = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const company=await this._reapplyCompany.reapplyCompany(user)
            res.json({company})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

    deleteCompany = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._deleteCompany.deleteCompany(id)
            res.json({result})
        } catch (error: any) {
            res.status(400).json({message:error.message});
        }
    }

}