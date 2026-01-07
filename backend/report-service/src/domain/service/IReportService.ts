import { ReportDto } from "../../dto/ReportDto";

export interface IReportUser {
    reportUser(reporter:string, user:string, type:string):Promise<{success:boolean}>
}

export interface IReportCompany {
    reportCompany(reporter:string, company:string, type:string): Promise<{success:boolean}>
}

export interface IGetPaginatedReports {
    getReports(start:number, limit:number, filter:string): Promise<{reports:ReportDto[], pageLimit:number}>
}

export interface IGetPreviousUserReports {
    getPreviousReports(id:string): Promise<ReportDto[]>
}

export interface IGetReportDetails {
    getReportDetails(reportId:string): Promise<{success:boolean, report?:ReportDto}>
}

export interface ICloseReport {
    closeReport(reportId:string): Promise<{success:boolean}>
}

export interface IReportMessage {
    reportMessage(reporter:string, sendBy:string, chat:string, type:string): Promise<{success:boolean}>
}

export interface IGetReportAnalytics {
    getReportAnalytics(): Promise<Array<{ reason: string; count: number }>>
}

export interface IGetTodayReportCount {
    getTodayReportCount(): Promise<number>
}