import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes"
import { injectable, inject } from "inversify"
import { TYPES } from "../../types"
import { IAddJob } from "../../domain/use-cases/IJobUseCase"
import axios from "axios"

@injectable()
export class JobController {

    constructor(
        @inject(TYPES.IAddJob) private _addJob:IAddJob
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

}