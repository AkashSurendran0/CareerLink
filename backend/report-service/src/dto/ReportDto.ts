export interface ReportDto {
    id:string,
    reportedBy:string | null,
    reportedChat:string | null,
    reportedAccount:string | null,
    reason:string,
    status:string,
    createdAt:Date,
    reportedCompany:string
}