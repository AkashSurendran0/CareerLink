import { inject, injectable } from "inversify";
import { IGetReportAnalytics } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";

@injectable()
export class GetReportAnalyics implements IGetReportAnalytics {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async getReportAnalytics(): Promise<Array<{ reason: string; count: number }>> {
        const result=await this._reportRepository.getReportAnalytics();
        return result;
    }

}