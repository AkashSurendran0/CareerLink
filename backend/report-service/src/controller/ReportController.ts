import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { ICloseReport, IGetPaginatedReports, IGetPreviousUserReports, IGetReportAnalytics, IGetReportDetails, IGetTodayReportCount, IReportCompany, IReportMessage, IReportUser } from "../domain/service/IReportService";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

@injectable()
export class ReportController {

    constructor(
        @inject(TYPES.IReportUser) private _reportUser:IReportUser,
        @inject(TYPES.IReportCompany) private _reportCompany:IReportCompany,
        @inject(TYPES.IGetPaginatedReports) private _getPaginatedReports:IGetPaginatedReports,
        @inject(TYPES.IGetPreviousUserReports) private _getPreviousUserReports:IGetPreviousUserReports,
        @inject(TYPES.IGetReportDetails) private _getReportDetails:IGetReportDetails,
        @inject(TYPES.ICloseReport) private _closeReport:ICloseReport,
        @inject(TYPES.IReportMessage) private _reportMessage:IReportMessage,
        @inject(TYPES.IGetReportAnalytics) private _getReportAnalytics:IGetReportAnalytics,
        @inject(TYPES.IGetTodayReportCount) private _getTodayReportCount:IGetTodayReportCount
    ){}

    reportUser = async (req:Request, res:Response) => {
        try {
            const reporter=req.headers['user-id'] as string
            const {user, type}=req.query
            const result=await this._reportUser.reportUser(reporter, user, type)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    reportCompany = async (req:Request, res:Response) => {
        try {
            const reporter=req.headers['user-id'] as string
            const {company, type}=req.query
            const result=await this._reportCompany.reportCompany(reporter, company, type)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getPaginatedReports = async (req:Request, res:Response) => {
        try {
            const {startingPage, limit, status}=req.query
            const startPage=Number(startingPage)
            const lim=Number(limit)
            let result=await this._getPaginatedReports.getReports(startPage, lim, status)
            for(let i=0;i<result.reports.length;i++){
                const userDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result.reports[i]?.reportedBy}`);
                result.reports[i].reportedUserName = userDetails?.data?.result?.result?.username
                if(result.reports[i]?.reportedAccount){
                    const reportedAccountDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result.reports[i]?.reportedAccount}`)
                    result.reports[i].reportedAccountName = reportedAccountDetails?.data?.result?.result?.username
                }else if(result.reports[i]?.reportedCompany){
                    const reportedCompanyDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/company/v1/getCompanyDetailsByQuery?id=${result.reports[i]?.reportedCompany}`)
                    result.reports[i].reportedCompanyName = reportedCompanyDetails?.data?.result?.name
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

    getPreviousUserReports = async (req:Request, res:Response) => {
        try {
            const {id}=req.query
            const result=await this._getPreviousUserReports.getPreviousReports(id)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getReportDetails = async (req:Request, res:Response) => {
        try {
            const {reportId}=req.query
            let result=await this._getReportDetails.getReportDetails(reportId)
            if(result.success){
                const userDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${result?.report?.reportedBy}`);
                result.report.reportedUserName = userDetails?.data?.result?.result?.username
                result.report.reportedUserProfile = userDetails?.data?.result?.pfp
                result.report.reportedUserEmail = userDetails?.data?.result?.result?.email
                result.report.reportedUserStatus = userDetails?.data?.result?.result?.suspended
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

    closeReport = async (req:Request, res:Response) => {
        try {
            const {reportId}=req.query
            const result=await this._closeReport.closeReport(reportId)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    reportMessage = async (req:Request, res:Response) => {
        try {
            const id=req.headers['user-id'] as string
            const {sendBy, chat, type} = req.query
            const result=await this._reportMessage.reportMessage(id, sendBy, chat, type)
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getReportAnalytics = async (req:Request, res:Response) => {
        try {
            const result=await this._getReportAnalytics.getReportAnalytics()
            res.json({result})
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    }

    getTodayReportCount = async (req:Request, res:Response) => {
        try {
            const result=await this._getTodayReportCount.getTodayReportCount()
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