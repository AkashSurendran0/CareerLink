import { inject, injectable } from "inversify";
import { IGetTodayReportCount } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";

@injectable()
export class GetTodayReportCount implements IGetTodayReportCount {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async getTodayReportCount(): Promise<number> {
        const result=await this._reportRepository.getTodayReportCount();
        return result;
    }

}