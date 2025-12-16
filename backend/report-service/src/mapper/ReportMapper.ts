import { ReportDto } from "../dto/ReportDto";

export class ReportMapper {
    static toDTO (report:any): ReportDto {
        return {
            id:report.id,
            reportedBy:report.reportedBy,
            reportedChat:report.reportedChat,
            reportedAccount:report.reportedAccount,
            reason:report.reason,
            status:report.status,
            createdAt:report.createdAt,
            reportedCompany:report.reportedCompany
        }
    }
}