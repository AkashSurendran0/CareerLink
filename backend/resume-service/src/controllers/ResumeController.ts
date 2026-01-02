import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types";
import { ICheckNormalVersion, ICheckTailoredVersion, ICreateCoverLetter, ICreateResume, ICreateTailoredCoverLetter, ICreateTailoredResume, IDeleteCount, IGetAllUserResumes, IUploadResume } from "../domain/services/IResumeServices";
import { STATUS_CODES } from "../utils/StatusCodes";
import { uploadResume } from "../config/upload";
import axios from "axios";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

dotenv.config()

@injectable()
export class ResumeController {

    constructor(
        @inject(TYPES.ICreateResume) private _createResume:ICreateResume,
        @inject(TYPES.IUploadResume) private _uploadResume:IUploadResume,
        @inject(TYPES.IGetAllUserResumes) private _getAllUserResumes:IGetAllUserResumes,
        @inject(TYPES.ICreateCoverLetter) private _createCoverLetter:ICreateCoverLetter,
        @inject(TYPES.ICreateTailoredResume) private _createTailoredResume:ICreateTailoredResume,
        @inject(TYPES.ICreateTailoredCoverLetter) private _createTailoredCoverLetter:ICreateTailoredCoverLetter,
        @inject(TYPES.ICheckTailoredVersion) private _checkTailoredVersion:ICheckTailoredVersion,
        @inject(TYPES.IDeleteCount) private _deleteCount:IDeleteCount,
        @inject(TYPES.ICheckNormalVersion) private _checkNormalVersion:ICheckNormalVersion
    ){}

    createResume = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const id=req.headers['user-id'] as string
            const subscription=await axios.get(`${process.env.API_GATEWAY_ROUTE}/subscription/v1/getUserPlan?user=${id}`)
            let result=await this._checkNormalVersion.checkResume(subscription?.data?.result, id)
            if(!result.success){
                return res.json({result})
            }
            const createResult = await this._createResume.createResume(data)
            if (!createResult.success) {
                return res.json({result: createResult})
            }
            const base64Pdf=createResult.pdf.toString('base64')
            const finalResult = {success: createResult.success, html: createResult.html, base64Pdf}
            res.json({result: finalResult})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    saveResume = async (req:Request, res:Response) => {
        try {
            const {resumeName}=req.body
            const buffer=req.file?.buffer
            const userId=req.headers['user-id'] as string
            const url=await uploadResume(buffer!)
            const result=await this._uploadResume.uploadResume(url, userId, resumeName)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getAllUserResumes = async (req:Request, res:Response) => {
        try {
            const userId=req.headers['user-id'] as string
            const resumes=await this._getAllUserResumes.getAllResumes(userId)
            res.json({resumes})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    createCoverLetter = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const id=req.headers['user-id'] as string
            const subscription=await axios.get(`${process.env.API_GATEWAY_ROUTE}/subscription/v1/getUserPlan?user=${id}`)
            let result=await this._checkNormalVersion.checkResume(subscription?.data?.result, id)
            if(!result.success){
                return res.json({result})
            }
            result=await this._createCoverLetter.createCoverLetter(data)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getTailoredResume = async (req:Request, res:Response) => {
        try {
            const email=req.headers['user-email'] as string
            const id=req.headers['user-id'] as string
            const {job}=req.query
            const token=req.cookies?.token
            const subscription=await axios.get(`${process.env.API_GATEWAY_ROUTE}/subscription/v1/getUserPlan?user=${id}`)
            let result=await this._checkTailoredVersion.checkTailoredResume(subscription.data.result, id)
            if(!result.success){
                return res.json({result})
            }
            const jobDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/job/v1/getJobDetails?id=${job}`)
            const userDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getUserInfo?user=${email}`)
            const details=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getUserDetails`, {
                headers:{
                    Cookie:`token=${token}`
                }
            })
            if(!details.data.userDetails){
                res.json({success:false, message:'User doesnt have sufficient details'})
                return
            } 
            result=await this._createTailoredResume.createTailoredResume(jobDetails.data.details, details.data.userDetails, userDetails.data.result)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getTailoredCoverLetter = async (req:Request, res:Response) => {
        try {
            const {job}=req.query
            const email=req.headers['user-email'] as string
            const id=req.headers['user-id'] as string
            const token=req.cookies?.token
            const subscription=await axios.get(`${process.env.API_GATEWAY_ROUTE}/subscription/v1/getUserPlan?user=${id}`)
            let result=await this._checkTailoredVersion.checkTailoredCoverLetter(subscription.data.result, id)
            if(!result.success){
                return res.json({result})
            }
            const jobDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/job/v1/getJobDetails?id=${job}`)
            const userDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getUserInfo?user=${email}`)
            const details=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getUserDetails`, {
                headers:{
                    Cookie:`token=${token}`
                }
            })
            if(!details.data || !details || !details.data.userDetails){
                res.json({success:false, message:'User doesnt have sufficient details'})
                return 
            } 
            result=await this._createTailoredCoverLetter.createTailoredCoverLetter(jobDetails.data.details, details.data.userDetails, userDetails.data.result)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    deletePlan = async (req:Request, res:Response) => {
        try {
            const {user}=req.query
            if (typeof user !== 'string') {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "user parameter is required" });
            }
            const result=await this._deleteCount.deleteCount(user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error({error}, 'error')
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}