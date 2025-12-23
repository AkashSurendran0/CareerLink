import { Request, Response } from "express"
import { STATUS_CODES } from "../../utils/StatusCodes"
import { injectable, inject } from "inversify"
import { TYPES } from "../../types"
import { IAddJob, IApplyJob, ICloseJobApplication, IEditJob, IGetAvailableJobs, IGetJobDetails, IGetAllJobs, IGetUserAppliedJobs, IGetJobApplicants, IAlterUserApplication, IGetCompanyAnalytics, IGetJobApplicationAnalytics } from "../../domain/use-cases/IJobUseCase"
import axios from "axios"
import { uploadResume } from "../../config/upload"
import { rabbitmqService } from "../../utils/Rabbitmq"

@injectable()
export class JobController {

    constructor(
        @inject(TYPES.IAddJob) private _addJob:IAddJob,
        @inject(TYPES.IGetAllJobs) private _getAllJobs:IGetAllJobs,
        @inject(TYPES.IGetJobDetails) private _getJobDetails:IGetJobDetails,
        @inject(TYPES.IEditJob) private _editJob:IEditJob,
        @inject(TYPES.ICloseJobApplication) private _closeJobApplication:ICloseJobApplication,
        @inject(TYPES.IGetAvailableJobs) private _getAvailableJobs:IGetAvailableJobs,
        @inject(TYPES.IApplyJob) private _applyJob:IApplyJob,
        @inject(TYPES.IGetUserAppliedJobs) private _getUserAppliedJobs:IGetUserAppliedJobs,
        @inject(TYPES.IGetJobApplicants) private _getJobApplicants:IGetJobApplicants,
        @inject(TYPES.IAlterUserApplication) private _alterUserApplication:IAlterUserApplication,
        @inject(TYPES.IGetCompanyAnalytics) private _getCompanyAnalytics:IGetCompanyAnalytics,
        @inject(TYPES.IGetJobApplicationAnalytics) private _getJobApplicationAnalytics:IGetJobApplicationAnalytics
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
            const {id}=req.query
            let company;
            if(id != 'null'){
                company=await axios.get(`http://localhost:5000/company/v1/getCompanyDetailsByQuery?id=${id}`, {
                    headers:{
                        Cookie:`token=${token}`
                    }
                })
            }else{
                company=await axios.get('http://localhost:5000/company/v1/getCompanyDetails', {
                    headers:{
                        Cookie:`token=${token}`
                    }
                })
            }
            const companyId=company.data.result.id
            const {start, limit, query, filter}=req.query
            const numStart=Number(start)
            const numLimit=Number(limit)
            const result=await this._getAllJobs.getAllJobs(companyId, numStart, numLimit, query, filter)
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
            const user=req.headers['user-id'] as string
            console.log(user)
            const {query}=req.query
            const jobs=await this._getAvailableJobs.getAvailableJobs(query, user)
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

    getUserAppliedJobs = async (req:Request, res:Response) => {
        try {
            const user=req.headers['user-id'] as string
            let jobs=await this._getUserAppliedJobs.getJobs(user)
            if(jobs.success){
                let companyDetails=new Set()
                jobs.jobs.forEach(i=>{
                    companyDetails.add(i.details.company)
                })
                for(let id of companyDetails){
                    let result=await axios.get(`http://localhost:5000/company/v1/checkCompanyDetails?id=${id}`)
                    for(let i=0;i<jobs.jobs.length;i++){
                        if(jobs.jobs[i].details.company==id){
                            jobs.jobs[i].companyName=result.data.company.name
                            jobs.jobs[i].companyLogo=result.data.company.logo
                        }
                    }
                }
            }   
            res.json({jobs})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getJobApplicants = async (req:Request, res:Response) => {
        try {
            const {job}=req.query
            let result=await this._getJobApplicants.getApplicants(job)
            if(result){
                for(let i=0;i<result.applicants.length;i++){
                    const user=await axios.get(`http://localhost:5000/user/v1/getDetailsByQuery?id=${result.applicants[i].user}`)
                    result.applicants[i]!.userName=user.data.result.result.username
                }
            }
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    alterUserApplication = async (req:Request, res:Response) => {
        try {
            const {jobId, user, company, action}=req.query
            const userDetails=await axios.get(`http://localhost:5000/user/v1/getDetailsByQuery?id=${user}`)
            if(action=='accept'){
                const result=await this._alterUserApplication.acceptApplication(jobId, user)
                console.log(result)
                if(result.success){
                    const conversation=await axios.post(`http://localhost:5000/chat/v1/startUserConversation?company=${company}&user=${user}`)
                    const message=`Congratulations,
Your application has been shortlisted by our hiring team.
Our team will review your profile in detail and contact you with the next steps shortly.

Thank you for your interest in joining our company`;
                    const data={
                        convoId:conversation.data.result.id,
                        message
                    }
                    await axios.patch(`http://localhost:5000/chat/v1/sendMessage?company=${company}`, data)
                    await rabbitmqService.publishEvent("jobApplication.events", "jobApplication.accepted", {
                        userEmail:userDetails.data?.result?.result?.email,
                        action:'applicationAccepted'
                    })
                }
                res.json({result}) 
            }else if(action=='reject'){
                const result=await this._alterUserApplication.rejectApplication(jobId, user)
                await rabbitmqService.publishEvent("jobApplication.events", "jobApplication.rejected", {
                    userEmail:userDetails.data?.result?.result?.email,
                    action:'applicationRejected'
                })
                res.json({result})
            }else{
                const result={success:false}
                res.json({result})
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getCompanyAnalytics = async (req:Request, res:Response) => {
        try {
            const result=await this._getCompanyAnalytics.getCompanyAnalytics()
            const companyDetails=await Promise.all(
                result.map(async job=>{
                    const result=await axios.get(`http://localhost:5000/company/v1/checkCompanyDetails?id=${job._id}`)
                    return {
                        ...job,
                        name:result.data.company.name
                    }
                })
            )
            res.json({companyDetails})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getJobApplicationAnalytics = async (req:Request, res:Response) => {
        try {
            const result=await this._getJobApplicationAnalytics.getJobApplicationAnalytics()
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