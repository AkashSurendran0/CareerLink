import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes"
import { injectable, inject } from "inversify"
import { TYPES } from "../../types"
import { IAddJob, IEditJob, IGetJobDetails } from "../../domain/use-cases/IJobUseCase"
import axios from "axios"
import { IGetAllJobs } from "../../domain/use-cases/IJobUseCase"

@injectable()
export class JobController {

    constructor(
        @inject(TYPES.IAddJob) private _addJob:IAddJob,
        @inject(TYPES.IGetAllJobs) private _getAllJobs:IGetAllJobs,
        @inject(TYPES.IGetJobDetails) private _getJobDetails:IGetJobDetails,
        @inject(TYPES.IEditJob) private _editJob:IEditJob
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
            const result=await this._getAllJobs.getAllJobs(id)
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

}