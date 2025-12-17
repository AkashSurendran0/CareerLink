import { inject, injectable } from "inversify";
import { IReportMessage } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";

@injectable()
export class ReportMessage implements IReportMessage {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async reportMessage(reporter: string, sendBy: string, chat: string, type: string): Promise<{ success: boolean; }> {
        const result=await this._reportRepository.reportMessage(reporter, sendBy, chat, type)
        return result
    }

}