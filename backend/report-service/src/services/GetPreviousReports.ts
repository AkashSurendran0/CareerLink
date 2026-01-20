import { inject, injectable } from "inversify";
import { IGetPreviousUserReports } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";
import { ReportDto } from "../dto/ReportDto";
import { ReportMapper } from "../mapper/ReportMapper";

@injectable()
export class GetPreviousUserReports implements IGetPreviousUserReports {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async getPreviousReports(id: string): Promise<ReportDto[]> {
        const result=await this._reportRepository.getPreviousUserReports(id);
        return result.map((report)=>ReportMapper.toDTO({
            id: report.id,
            reportedBy: report.reportedBy ?? null,
            reportedChat: report.reportedChat ?? null,
            reportedAccount: report.reportedAccount ?? null,
            reportedConvo: report.reportedConvo ?? null,
            reason: report.reason,
            status: report.status,
            createdAt: report.createdAt,
            reportedCompany: report.reportedCompany ?? null
        }));
    }

}