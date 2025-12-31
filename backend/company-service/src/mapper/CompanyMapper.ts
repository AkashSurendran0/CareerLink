import { CompanyDTO } from "../dto/CompanyDTO"

export class CompanyMapper {
    static toDTO(company: any): CompanyDTO {
        return {
            id: company.id,
            logo: company.logo,
            name: company.name,
            registeredBy: company.registeredBy,
            companySize: company.companySize,
            foundedYear: company.foundedYear,
            industry: company.industry,
            websiteURL: company.websiteURL,
            location: company.location,
            aboutCompany: company.aboutCompany,
            approved: company.approved,
            suspended: company.suspended,
            rejected: company.rejected,
            createdAt: company.createdAt,
            rejectReasons: company.rejectReasons
        }
    }
}