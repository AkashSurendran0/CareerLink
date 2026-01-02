import { CompanyDTO } from "../dto/CompanyDTO"

export class CompanyMapper {
    static toDTO(company: any): CompanyDTO {
        const foundedYear = typeof company.foundedYear === 'string' ? parseInt(company.foundedYear, 10) || 0 : (company.foundedYear ?? 0)
        return {
            id: company.id,
            logo: company.logo,
            name: company.name,
            registeredBy: company.registeredBy,
            companySize: String(company.companySize),
            foundedYear,
            industry: company.industry,
            websiteURL: company.websiteURL ?? null,
            location: company.location,
            aboutCompany: company.aboutCompany,
            approved: Boolean(company.approved),
            suspended: Boolean(company.suspended),
            rejected: Boolean(company.rejected),
            createdAt: company.createdAt,
            rejectReasons: company.rejectReasons ?? null
        }
    }
}