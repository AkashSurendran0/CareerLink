import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes"
import { injectable, inject } from "inversify"
import { TYPES } from "../../types"
import { IAddJob, IApplyJob, ICloseJobApplication, IEditJob, IGetAvailableJobs, IGetJobDetails, IGetAllJobs } from "../../domain/use-cases/IJobUseCase"
import axios from "axios"
import { uploadResume } from "../../config/upload"

@injectable()
export class JobController {

    constructor(
        @inject(TYPES.IAddJob) private _addJob:IAddJob,
        @inject(TYPES.IGetAllJobs) private _getAllJobs:IGetAllJobs,
        @inject(TYPES.IGetJobDetails) private _getJobDetails:IGetJobDetails,
        @inject(TYPES.IEditJob) private _editJob:IEditJob,
        @inject(TYPES.ICloseJobApplication) private _closeJobApplication:ICloseJobApplication,
        @inject(TYPES.IGetAvailableJobs) private _getAvailableJobs:IGetAvailableJobs,
        @inject(TYPES.IApplyJob) private _applyJob:IApplyJob
    ){}

    addJob = async (req:Request, res:Response) => {
        try {
            const jobDetails=req.body
            const token=req.cookies?.token
            const company=await axios.get('http://localhost:5000/company/v1/getCompanyDetails', {
                headers:{
                    Cookie:`token=${token}`
                }
            })
            const id=company.data.result.id
            const result=await this._addJob.addJob(jobDetails, id)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getAllJobs = async (req:Request, res:Response) => {
        try {
            const token=req.cookies?.token
            const company=await axios.get('http://localhost:5000/company/v1/getCompanyDetails', {
                headers:{
                    Cookie:`token=${token}`
                }
            })
            const id=company.data.result.id
            const {start, limit, query, filter}=req.query
            const numStart=Number(start)
            const numLimit=Number(limit)
            const result=await this._getAllJobs.getAllJobs(id, numStart, numLimit, query, filter)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getJobDetails = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const jobId=String(id)
            const details=await this._getJobDetails.getDetails(jobId)
            res.json({details})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    editJob = async (req:Request, res:Response) => {
        try {
            const jobDetails=req.body
            const result=await this._editJob.editJob(jobDetails)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    closeJobApplication = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const companyId=String(id)
            const result=await this._closeJobApplication.closeJob(companyId)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getAvailableJobs = async (req:Request, res:Response) => {
        try {
            const {query}=req.query
            const jobs=await this._getAvailableJobs.getAvailableJobs(query)
            const filledJobs=await Promise.all(
                jobs.map(async job=>{
                    const result=await axios.get(`http://localhost:5000/company/v1/checkCompanyDetails?id=${job.company}`)
                    return {
                        ...job,
                        company:result.data.company
                    }
                })
            )
            res.json({jobs:filledJobs})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    applyJobWithUrl = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            const data=req.body
            const result=await this._applyJob.applyJob(data, user)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    applyJobWithFile = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            const buffer=req.file?.buffer
            const {coverLetter, id}=req.body
            const resumeUrl=await uploadResume(buffer!)
            const data={
                id,
                resumeUrl,
                coverLetter
            }
            const result=await this._applyJob.applyJob(data, user)
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