import { CompanyDTO } from "../dto/CompanyDTO";

export type CompanySource = {
    id: string;
    logo?: string;
    name?: string;
    registeredBy?: string;
    companySize?: string | number;
    foundedYear?: string | number;
    industry?: string;
    websiteURL?: string | null;
    location?: string;
    aboutCompany?: string;
    approved?: boolean;
    suspended?: boolean;
    rejected?: boolean;
    createdAt?: Date | string;
    rejectReasons?: string[] | null;
}

export class CompanyMapper {
    static toDTO(company: CompanySource): CompanyDTO {
        const foundedYear = typeof company.foundedYear === "string" ? parseInt(company.foundedYear, 10) || 0 : (company.foundedYear ?? 0) as number;
        return {
            id: String(company.id),
            logo: company.logo ?? "",
            name: company.name ?? "",
            registeredBy: company.registeredBy ?? "",
            companySize: String(company.companySize ?? ""),
            foundedYear,
            industry: company.industry ?? "",
            websiteURL: company.websiteURL ?? null,
            location: company.location ?? "",
            aboutCompany: company.aboutCompany ?? "",
            approved: Boolean(company.approved),
            suspended: Boolean(company.suspended),
            rejected: Boolean(company.rejected),
            createdAt: (company.createdAt instanceof Date) ? company.createdAt : new Date(String(company.createdAt ?? Date.now())),
            rejectReasons: company.rejectReasons ?? null
        };
    }
}