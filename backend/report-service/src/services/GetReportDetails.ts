import { inject, injectable } from "inversify";
import { IGetReportDetails } from "../domain/service/IReportService";
import { TYPES } from "../types";
import { IReportRepository } from "../domain/repository/IReportRepository";
import { ReportDto } from "../dto/ReportDto";
import { ReportMapper } from "../mapper/ReportMapper";

@injectable()
export class GetReportDetails implements IGetReportDetails {

    constructor(
        @inject(TYPES.IReportRepository) private _reportRepository:IReportRepository
    ){}

    async getReportDetails(reportId: string): Promise<{ success: boolean; report?: ReportDto; }> {
        const result=await this._reportRepository.findById(reportId);
        if(result.success){
            const report=ReportMapper.toDTO(result.report);
            return {success:true, report};
        }else{
            return result;
        }
    }

}