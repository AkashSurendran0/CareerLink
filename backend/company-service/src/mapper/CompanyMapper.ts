import { CompanyDTO } from "../dto/CompanyDTO";

export class CompanyMapper {
    static toDTO(company:any):CompanyDTO {
        return {
            id:company.id,
            logo:company.logo,
            name:company.name,
            companySize:company.companySize,
            foundedYear:company.foundedYear,
            industry:company.industry,
            websiteURL:company.websiteURL,
            location:company.location,
            aboutCompany:company.aboutCompany,
            approved:company.approved,
            suspended:company.suspended,
            createdAt:company.createdAt,
        }
    }
}