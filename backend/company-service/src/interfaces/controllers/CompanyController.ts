import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { uploadImageToS3 } from "../../config/upload";
import { TYPES } from "../../types";
import { IAddCompany, IGetActiveCompanyCount, IGetAvailableCompanies, IGetCompanyDetailsByQuery } from "../../domain/use-cases/ICompanyUserCase";
import { ICheckCompanyRegistrationInfo } from "../../domain/use-cases/ICompanyUserCase";
import { IGetCompanyDetails } from "../../domain/use-cases/ICompanyUserCase";
import { IEditCompany } from "../../domain/use-cases/ICompanyUserCase";
import { IGetAllCompanies } from "../../domain/use-cases/ICompanyUserCase";
import { IAlterCompanyStatus } from "../../domain/use-cases/ICompanyUserCase";
import { ICheckCompanyDetails } from "../../domain/use-cases/ICompanyUserCase";
import { IAlterCompanyRegistrationStatus } from "../../domain/use-cases/ICompanyUserCase";
import { IReapplyCompany } from "../../domain/use-cases/ICompanyUserCase";
import { IDeleteCompany } from "../../domain/use-cases/ICompanyUserCase";
import { STATUS_CODES } from "../../utils/StatusCodes";

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
        @inject(TYPES.IDeleteCompany) private _deleteCompany:IDeleteCompany,
        @inject(TYPES.IGetAvailableCompanies) private _getAvailableCompanies:IGetAvailableCompanies,
        @inject(TYPES.IGetCompanyDetailsByQuery) private _getCompanyDetailsByQuery:IGetCompanyDetailsByQuery,
        @inject(TYPES.IGetActiveCompanyCount) private _getActiveCompanyCount:IGetActiveCompanyCount
    ){}

    addCompany = async (req:Request, res:Response): Promise<void> => {
        try {
            console.log(1)
            const user=req.headers["user-email"] as string
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
            await this._addCompany.addCompany(user, details)
            res.json({success:true})
        } catch (error: unknown) {  
            if (error instanceof Error) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getRegistrationInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            const user=req.headers["user-email"] as string
            const result=await this._checkCompanyRegistrationInfo.checkCompanyRegistrationInfo(user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getCompanyInfo = async (req:Request, res:Response):Promise<void> => {
        try {
            const user=req.headers["user-email"] as string
            const result=await this._getCompanyDetails.getCompanyDetails(user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    editCompany = async  (req:Request, res:Response):Promise<void> => {
        try {
            console.log(1)
            const user=req.headers["user-email"] as string
            let imageUrl:string | undefined
            if(req.file){
                imageUrl=await uploadImageToS3(req.file.buffer, req.file.mimetype.split("/")[1])
            }
            const details=req.body
            if(imageUrl){
                details.logo=imageUrl
            }
            await this._editCompany.editCompany(user, details)
            res.json({success:true})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getApprovedCompanies = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit, query}=req.query;
            const pageNum=parseInt(page as string, 10) || 1;
            const limitNum=parseInt(limit as string, 5) || 5;
            const companies=await this._getAllCompanies.getApprovedCompanies(pageNum, limitNum, query)
            res.json({companies})
        } catch (error:unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getPendingCompanies = async (req:Request, res:Response): Promise<void> => {
        try {
            const {page, limit, query}=req.query;
            const pageNum=parseInt(page as string, 10) || 1;
            const limitNum=parseInt(limit as string, 5) || 5;
            const companies=await this._getAllCompanies.getPendingCompanies(pageNum, limitNum, query)
            res.json({companies})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    changeCompanyStatus = async (req:Request, res:Response): Promise<void> => {
        try {
            const company=req.body
            const companies=await this._alterCompanyStatus.changeCompanyStatus(company.id)
            res.json({companies})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    checkCompanyDetails = async (req:Request, res:Response): Promise<void> => {
        try {
            const {id}=req.query
            const company=await this._checkCompanyDetails.getCompanyInfo(id)
            res.json({company})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    rejectCompany = async (req:Request, res:Response): Promise<void> => {
        try {
            const reason=req.body
            const {id}=req.query
            const result=await this._alterCompanyRegistrationStatus.rejectCompany(id, reason)
            res.json({result}) 
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    acceptCompany = async (req:Request, res:Response): Promise<void> => {
        try {
            const {id}=req.query
            const result=await this._alterCompanyRegistrationStatus.acceptCompany(id)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    reapplyCompany = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-email'] as string
            const company=await this._reapplyCompany.reapplyCompany(user)
            res.json({company})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    deleteCompany = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._deleteCompany.deleteCompany(id)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getAvailableCompanies = async (req:Request, res:Response) => {
        try {
            const email=req.headers['user-email'] as string
            const {name}=req.query
            const query=name || null
            const result=await this._getAvailableCompanies.getAvailableCompanies(email, query)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getCompanyDetailsByQuery = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._getCompanyDetailsByQuery.getCompanyDetails(id)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getActiveCompanyCount = async (req:Request, res:Response) => {
        try {
            const result=await this._getActiveCompanyCount.getActiveCompanyCount()
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