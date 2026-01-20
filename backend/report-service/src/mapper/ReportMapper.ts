import { ReportDto } from "../dto/ReportDto";
import { Report } from "../domain/entity/Report";

export class ReportMapper {
    static toDTO(report: Report): ReportDto {
        return {
            id: report.id,
            reportedBy: report.reportedBy,
            reportedChat: report.reportedChat,
            reportedConvo: report.reportedConvo,
            reportedAccount: report.reportedAccount,
            reason: report.reason,
            status: report.status,
            createdAt: report.createdAt,
            reportedCompany: report.reportedCompany
        };
    }
}