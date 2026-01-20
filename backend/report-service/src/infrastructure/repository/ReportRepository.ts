import { Op, QueryTypes } from "sequelize";
import { Report } from "../../domain/entity/Report";
import { IReportRepository } from "../../domain/repository/IReportRepository";
import { sequelize } from "../database/Sequelize";
import { ReportModel } from "../model/ReportModel";

export class ReportRepository implements IReportRepository {
    
    async reportUser(reporter: string, user: string, type: string): Promise<{ success: boolean; }> {
        const existingReport=await ReportModel.findOne({
            where:{
                reportedBy:reporter,
                reportedAccount:user,
                status:"Pending"
            }
        });
        if(existingReport) return {success:false};
        await ReportModel.create(
            {
                reportedBy:reporter,
                reportedAccount:user,
                reason:type
            }
        );
        return {success:true};
    }

    async reportCompany(reporter: string, company: string, type: string): Promise<{ success: boolean; }> {
        const existingReport=await ReportModel.findOne({
            where:{
                reportedBy:reporter,
                reportedCompany:company,
                status:"Pending"
            }
        });
        if(existingReport) return {success:false};
        await ReportModel.create(
            {
                reportedBy:reporter,
                reportedCompany:company,
                reason:type
            }
        );
        return {success:true};
    }

    async getPaginatedReports(start: number, limit: number, filter: string): Promise<{reports:Report[], pageLimit:number}> {
        let totalCount;
        let pageLimit;
        let beginning=(start-1)*limit;
        let reports;
        if(filter=="All"){
            totalCount=await ReportModel.findAll({raw:true});
            totalCount=totalCount.length;
            reports=await ReportModel.findAll({
                limit:limit,
                offset:beginning,
                raw:true
            });
            pageLimit = Math.ceil(totalCount / limit);
        }else{
            totalCount=await ReportModel.findAll({where:{status:filter}, raw:true});
            totalCount=totalCount.length;
            reports=await ReportModel.findAll({
                where:{status:filter},
                limit:limit,
                offset:beginning,
                raw:true
            });
            pageLimit = Math.ceil(totalCount / limit);
        }
        type ReportRecord = {
            id: string;
            reportedBy?: string | null;
            reportedChat?: string | null;
            reportedAccount?: string | null;
            reportedConvo?:string | null;
            reason: string;
            status: string;
            createdAt: Date;
            reportedCompany?: string | null;
        };

        reports= reports.map((report: ReportRecord)=>{
            return new Report(
                report.id,
                report.reportedBy,
                report.reportedChat,
                report.reportedConvo,
                report.reportedAccount,
                report.reason,
                report.status,
                report.createdAt,
                report.reportedCompany
            );
        });
        return {reports, pageLimit};
    }

    async getPreviousUserReports(id: string): Promise<Report[]> {
        type ReportRecord = {
            id: string;
            reportedBy?: string | null;
            reportedChat?: string | null;
            reportedConvo?:string | null;
            reportedAccount?: string | null;
            reason: string;
            status: string;
            createdAt: Date;
            reportedCompany?: string | null;
        };

        const reports=await ReportModel.findAll({where:{reportedAccount:id}, raw:true}) as ReportRecord[];
        return reports.map((report) => {
            return new Report(
                report.id,
                report.reportedBy,
                report.reportedChat,
                report.reportedConvo,
                report.reportedAccount,
                report.reason,
                report.status,
                report.createdAt,
                report.reportedCompany
            );
        });
    }

    async findById(id: string): Promise<{success:boolean, report?:Report}>{
        const existingReport=await ReportModel.findOne({where:{id:id}, raw:true});
        if(!existingReport) return {success:false};
        const report=new Report (
            existingReport.id,
            existingReport.reportedBy ?? null,
            existingReport.reportedChat ?? null,
            existingReport.reportedConvo ?? null,
            existingReport.reportedAccount ?? null,
            existingReport.reason,
            existingReport.status,
            existingReport.createdAt,
            existingReport.reportedCompany ?? ""
        );
        return {success:true, report};
    }

    async closeReport(id: string): Promise<{ success: boolean; }> {
        await ReportModel.update(
            {status:"Closed"},
            {where:{id:id}}
        );
        return {success:true};
    }

    async reportMessage(reporter: string, convo: string, chat: string, type: string): Promise<{ success: boolean; }> {
        const existingReport=await ReportModel.findOne({
            where:{
                reportedBy:reporter,
                reportedConvo:convo,
                status:"Pending"
            }
        });
        if(existingReport) return {success:false};
        await ReportModel.create(
            {
                reportedBy:reporter,
                reportedConvo:convo,
                reportedChat:chat, 
                reason:type
            }
        );
        return {success:true};
    }

    async getReportAnalytics(): Promise<Array<{ reason: string; count: number }>> {
        const result = await sequelize.query(
            `
            SELECT reason, COUNT(*) AS count
            FROM reports
            GROUP BY reason
            `,
            { type: QueryTypes.SELECT }
        );
        return result as Array<{ reason: string; count: number }>;
    }

    async getTodayReportCount(): Promise<number> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const count = await ReportModel.count({
            where: {
            createdAt: {
                [Op.gte]: startOfDay,
                [Op.lte]: endOfDay,
            },
            },
        });

        return count;
    }

}