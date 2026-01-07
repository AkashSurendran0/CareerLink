import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/StatusCodes";
import { TYPES } from "../types";
import { ICloseReport, IGetPaginatedReports, IGetPreviousUserReports, IGetReportAnalytics, IGetReportDetails, IGetTodayReportCount, IReportCompany, IReportMessage, IReportUser } from "../domain/service/IReportService";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

type ReportDtoWithExtras = import("../dto/ReportDto").ReportDto & {
    reportedUserName?: string | null;
    reportedAccountName?: string | null;
    reportedCompanyName?: string | null;
    reportedUserProfile?: string | null;
    reportedUserEmail?: string | null;
    reportedUserStatus?: boolean | null;
};

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
            const reporter=req.headers["user-id"] as string;
            const {user, type}=req.query;
            if (typeof user !== "string" || typeof type !== "string") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "user and type parameters are required" });
            }
            const result=await this._reportUser.reportUser(reporter, user, type);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    reportCompany = async (req:Request, res:Response) => {
        try {
            const reporter=req.headers["user-id"] as string;
            const {company, type}=req.query;
            if (typeof company !== "string" || typeof type !== "string") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "company and type parameters are required" });
            }
            const result=await this._reportCompany.reportCompany(reporter, company, type);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getPaginatedReports = async (req:Request, res:Response) => {
        try {
            const {startingPage, limit, status}=req.query;
            const startPage=Number(startingPage);
            const lim=Number(limit);
            const filterStatus = typeof status === "string" ? status : "All";
            let result=await this._getPaginatedReports.getReports(startPage, lim, filterStatus);
            for(let i=0;i<result.reports.length;i++){
                const report = result.reports[i];
                if (!report) continue;
                const reportWithExtras = report as unknown as ReportDtoWithExtras;
                const userDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${report.reportedBy}`);
                reportWithExtras.reportedUserName = userDetails?.data?.result?.result?.username ?? null;
                if(report.reportedAccount){
                    const reportedAccountDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${report.reportedAccount}`);
                    const accountName = reportedAccountDetails?.data?.result?.result?.username ?? null;
                    reportWithExtras.reportedAccountName = accountName;
                }else if(report.reportedCompany){
                    const reportedCompanyDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/company/v1/getCompanyDetailsByQuery?id=${report.reportedCompany}`);
                    const companyName = reportedCompanyDetails?.data?.result?.name ?? null;
                    reportWithExtras.reportedCompanyName = companyName;
                }
            }
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getPreviousUserReports = async (req:Request, res:Response) => {
        try {
            const {id}=req.query;
            if (typeof id !== "string") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "id parameter is required" });
            }
            const result=await this._getPreviousUserReports.getPreviousReports(id);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getReportDetails = async (req:Request, res:Response) => {
        try {
            const {reportId}=req.query;
            if (typeof reportId !== "string") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "reportId parameter is required" });
            }
            let result=await this._getReportDetails.getReportDetails(reportId);
            if(result.success && result.report){
                const report = result.report;
                const reportWithExtras = report as unknown as ReportDtoWithExtras;
                const userDetails=await axios.get(`${process.env.API_GATEWAY_ROUTE}/user/v1/getDetailsByQuery?id=${report.reportedBy}`);
                reportWithExtras.reportedUserName = userDetails?.data?.result?.result?.username ?? null;
                reportWithExtras.reportedUserProfile = userDetails?.data?.result?.pfp ?? null;
                reportWithExtras.reportedUserEmail = userDetails?.data?.result?.result?.email ?? null;
                reportWithExtras.reportedUserStatus = userDetails?.data?.result?.result?.suspended ?? null;
            }
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    closeReport = async (req:Request, res:Response) => {
        try {
            const {reportId}=req.query;
            if (typeof reportId !== "string") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "reportId parameter is required" });
            }
            const result=await this._closeReport.closeReport(reportId);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    reportMessage = async (req:Request, res:Response) => {
        try {
            const id=req.headers["user-id"] as string;
            const {sendBy, chat, type} = req.query;
            if (typeof sendBy !== "string" || typeof chat !== "string" || typeof type !== "string") {
                return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "sendBy, chat, and type parameters are required" });
            }
            const result=await this._reportMessage.reportMessage(id, sendBy, chat, type);
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getReportAnalytics = async (req:Request, res:Response) => {
        try {
            const result=await this._getReportAnalytics.getReportAnalytics();
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

    getTodayReportCount = async (req:Request, res:Response) => {
        try {
            const result=await this._getTodayReportCount.getTodayReportCount();
            res.json({result});
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(STATUS_CODES.UNAUTHORIZED).json({ message: error.message });
            } else {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Unexpected error occurred" });
            }
        }
    };

}