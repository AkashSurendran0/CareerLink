import { inject, injectable } from "inversify";
import { ICloseReport } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";

@injectable()
export class CloseReport implements ICloseReport {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async closeReport(reportId: string): Promise<{ success: boolean; }> {
        const result=await this._reportRepository.closeReport(reportId);
        return result;
    }

}