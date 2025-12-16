import { Report } from "../../domain/entity/Report";
import { IReportRepository } from "../../domain/repository/IReportRepository";
import { ReportModel } from "../model/ReportModel";

export class ReportRepository implements IReportRepository {
    
    async reportUser(reporter: string, user: string, type: string): Promise<{ success: boolean; }> {
        const existingReport=await ReportModel.findOne({
            where:{
                reportedBy:reporter,
                reportedAccount:user
            }
        })
        if(existingReport) return {success:false}
        await ReportModel.create(
            {
                reportedBy:reporter,
                reportedAccount:user,
                reason:type
            }
        )
        return {success:true}
    }

    async reportCompany(reporter: string, company: string, type: string): Promise<{ success: boolean; }> {
        const existingReport=await ReportModel.findOne({
            where:{
                reportedBy:reporter,
                reportedCompany:company
            }
        })
        if(existingReport) return {success:false}
        await ReportModel.create(
            {
                reportedBy:reporter,
                reportedCompany:company,
                reason:type
            }
        )
        return {success:true}
    }

    async getPaginatedReports(start: number, limit: number, filter: string): Promise<{reports:Report[], pageLimit:number}> {
        let totalCount;
        let pageLimit;
        let beginning=(start-1)*limit;
        let reports
        if(filter=='all'){
            totalCount=await ReportModel.findAll({raw:true})
            totalCount=totalCount.length
            reports=await ReportModel.findAll({
                limit:limit,
                offset:beginning,
                raw:true
            })
            pageLimit = Math.ceil(totalCount / limit);
        }else{
            totalCount=await ReportModel.findAll({where:{status:filter}, raw:true})
            totalCount=totalCount.length
            reports=await ReportModel.findAll({
                where:{status:filter},
                limit:limit,
                offset:beginning,
                raw:true
            })
            pageLimit = Math.ceil(totalCount / limit);
        }
        reports= reports.map((report:any)=>{
            return new Report(
                report.id,
                report.reportedBy,
                report.reportedChat,
                report.reportedAccount,
                report.reason,
                report.status,
                report.createdAt,
                report.reportedCompany
            )
        })
        return {reports, pageLimit}
    }

}