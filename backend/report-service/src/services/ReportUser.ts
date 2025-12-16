import { inject, injectable } from "inversify";
import { IReportUser } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";

@injectable()
export class ReportUser implements IReportUser {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async reportUser(reporter: string, user: string, type: string): Promise<{ success: boolean; }> {
        const result=await this._reportRepository.reportUser(reporter, user, type)
        return result
    }

}