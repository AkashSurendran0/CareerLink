import { inject, injectable } from "inversify";
import { IGetPaginatedReports } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";
import { ReportDto } from "../dto/ReportDto";
import { ReportMapper } from "../mapper/ReportMapper";

@injectable()
export class GetPaginatedReports implements IGetPaginatedReports {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async getReports(start: number, limit: number, filter: string): Promise<{reports:ReportDto[], pageLimit:number}> {
        const report=await this._reportRepository.getPaginatedReports(start, limit, filter);
        const dtoReports=report.reports.map(report => ReportMapper.toDTO(report));
        return {reports:dtoReports, pageLimit:report.pageLimit};
    }
    
}