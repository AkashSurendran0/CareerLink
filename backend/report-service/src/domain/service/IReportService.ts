import { ReportDto } from "../../dto/ReportDto"

export interface IReportUser {
    reportUser(reporter:string, user:string, type:string):Promise<{success:boolean}>
}

export interface IReportCompany {
    reportCompany(reporter:string, company:string, type:string): Promise<{success:boolean}>
}

export interface IGetPaginatedReports {
    getReports(start:number, limit:number, filter:string): Promise<{reports:ReportDto[], pageLimit:number}>
}