import { Report } from "../entity/Report";

export interface IReportRepository {
    reportUser(reporter: string, user: string, type: string): Promise<{success:boolean}>
    reportCompany(reporter:string, company:string, type:string): Promise<{success:boolean}>
    getPaginatedReports(start: number, limit: number, filter: string): Promise<{reports:Report[], pageLimit:number}>
    getPreviousUserReports(id:string): Promise<Report[]>
    findById(id:string): Promise<{success:boolean, report?:Report}>
    closeReport(id:string): Promise<{success:boolean}>
    reportMessage(reporter: string, sendBy: string, chat: string, type: string): Promise<{success:boolean}>
    getReportAnalytics(): Promise<Array<{ reason: string; count: number }>>
    getTodayReportCount(): Promise<number>
}