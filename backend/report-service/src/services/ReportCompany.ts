import { inject, injectable } from "inversify";
import { IReportCompany } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";

@injectable()
export class ReportCompany implements IReportCompany {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async reportCompany(reporter: string, company: string, type: string): Promise<{ success: boolean; }> {
        const result=await this._reportRepository.reportCompany(reporter, company, type);
        return result;
    }

}