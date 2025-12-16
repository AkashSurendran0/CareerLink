import { Report } from "../entity/Report"

export interface IReportRepository {
    reportUser(reporter: string, user: string, type: string): Promise<{success:boolean}>
    reportCompany(reporter:string, company:string, type:string): Promise<{success:boolean}>
    getPaginatedReports(start: number, limit: number, filter: string): Promise<{reports:Report[], pageLimit:number}>
}