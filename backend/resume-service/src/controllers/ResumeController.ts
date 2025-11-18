import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types";
import { ICreateCoverLetter, ICreateResume, IGetAllUserResumes, IUploadResume } from "../domain/services/IResumeServices";
import { STATUS_CODES } from "../utils/StatusCodes";
import { uploadResume } from "../config/upload";

@injectable()
export class ResumeController {

    constructor(
        @inject(TYPES.ICreateResume) private _createResume:ICreateResume,
        @inject(TYPES.IUploadResume) private _uploadResume:IUploadResume,
        @inject(TYPES.IGetAllUserResumes) private _getAllUserResumes:IGetAllUserResumes,
        @inject(TYPES.ICreateCoverLetter) private _createCoverLetter:ICreateCoverLetter
    ){}

    createResume = async (req:Request, res:Response): Promise<void> => {
        try {
            const data=req.body
            const {pdf, html}=await this._createResume.createResume(data)
            const base64Pdf=pdf.toString('base64')
            res.json({
                html,
                pdf:base64Pdf
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('error', error)
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    saveResume = async (req:Request, res:Response): Promise<void> => {
        try {
            const {resumeName}=req.body
            const buffer=req.file?.buffer
            const userId=req.headers['user-id'] as string
            const url=await uploadResume(buffer!)
            const result=await this._uploadResume.uploadResume(url, userId, resumeName)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('error', error)
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
                console.log('error', error)
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    createCoverLetter = async (req:Request, res:Response) => {
        try {
            const data=req.body
            const letter=await this._createCoverLetter.createCoverLetter(data)
            res.json({letter})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log('error', error)
                res.status(STATUS_CODES.NOT_FOUND).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

}