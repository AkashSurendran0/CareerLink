export interface ReportDto {
    id:string,
    reportedBy:string | null | undefined,
    reportedChat:string | null | undefined,
    reportedConvo:string | null | undefined,
    reportedAccount:string | null | undefined,
    reason:string,
    status:string,
    createdAt:Date,
    reportedCompany:string | undefined | null
}