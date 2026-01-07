import { ReportDto } from "../dto/ReportDto";

export class ReportMapper {
    static toDTO (report: { id: string; reportedBy?: string | null; reportedChat?: string | null; reportedAccount?: string | null; reason: string; status: string; createdAt: Date; reportedCompany?: string | null }): ReportDto {
        return {
            id:report.id,
            reportedBy:report.reportedBy,
            reportedChat:report.reportedChat,
            reportedAccount:report.reportedAccount,
            reason:report.reason,
            status:report.status,
            createdAt:report.createdAt,
            reportedCompany:report.reportedCompany
        };
    }
}