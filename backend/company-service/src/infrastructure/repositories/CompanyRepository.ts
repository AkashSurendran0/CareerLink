import { Company } from "../../domain/entities/Company";
import { CompanyModel } from "../models/CompanyModel";
import { injectable } from "inversify";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";

type Details = {
    registeredBy: string,
    logo: string,
    companyName: string,
    companySize: string,
    foundedYear: number,
    industry: string,
    websiteURL: string | null,
    location: string,
    rejectReasons: string[] | null | string,
    aboutCompany: string
}

@injectable()
export class CompanyRepository implements ICompanyRepository {

    async addCompany(user: string, details: Details): Promise<Company> {
        const newCompany = await CompanyModel.create({
            registeredBy: user,
            logo: details.logo,
            name: details.companyName,
            companySize: details.companySize,
            foundedYear: String(details.foundedYear),
            industry: details.industry,
            websiteURL: details.websiteURL,
            location: details.location,
            aboutCompany: details.aboutCompany
        })
        const companyData = newCompany.get({ plain: true })
        const companySizeStr = String(companyData!.companySize)
        const foundedYearNum = typeof companyData!.foundedYear === 'string' ? parseInt(companyData!.foundedYear, 10) || 0 : (companyData!.foundedYear ?? 0)
        return new Company(
            companyData!.id,
            companyData!.registeredBy,
            companyData!.logo,
            companyData!.name,
            companySizeStr,
            foundedYearNum,
            companyData!.industry,
            companyData!.location,
            companyData!.aboutCompany,
            Boolean(companyData!.approved),
            Boolean(companyData!.rejected),
            Boolean(companyData!.suspended),
            companyData!.createdAt,
            companyData!.websiteURL ?? null
        )
    }

    async checkCompany(user: string): Promise<{ success: boolean }> {
        const company = await CompanyModel.findOne({ where: { registeredBy: user } })
        if (company) return { success: true }
        return { success: false }
    }

    async getCompanyDetails(user: string): Promise<Company> {
        const companyDetails = await CompanyModel.findOne({ where: { registeredBy: user }, raw: true })
        const companySizeStr = String(companyDetails!.companySize)
        const foundedYearNum = typeof companyDetails!.foundedYear === 'string' ? parseInt(companyDetails!.foundedYear, 10) || 0 : (companyDetails!.foundedYear ?? 0)
        return new Company(
            companyDetails!.id,
            companyDetails!.registeredBy,
            companyDetails!.logo,
            companyDetails!.name,
            companySizeStr,
            foundedYearNum,
            companyDetails!.industry,
            companyDetails!.location,
            companyDetails!.aboutCompany,
            Boolean(companyDetails!.approved),
            Boolean(companyDetails!.rejected),
            Boolean(companyDetails!.suspended),
            companyDetails!.createdAt,
            companyDetails!.websiteURL ?? null,
            (companyDetails!.rejectReasons as string[]) || undefined
        )
    }

    async editCompany(user: string, details: Details): Promise<Company> {
        if (details.rejectReasons !== undefined) {
            if (details.rejectReasons === "null") {
                details.rejectReasons = null;
            }
            else if (typeof details.rejectReasons === "string") {
                details.rejectReasons = [details.rejectReasons];
            }
            else if (typeof details.rejectReasons === "object" && !Array.isArray(details.rejectReasons)) {
            }
        }
        const [rowsUpdated, updatedCompanies] = await CompanyModel.update(
            details,
            {
                where: { registeredBy: user },
                returning: true
            },
        )
        const updatedCompany = updatedCompanies[0]!.get({ plain: true });
        const companySizeStr = String(updatedCompany!.companySize)
        const foundedYearNum = typeof updatedCompany!.foundedYear === 'string' ? parseInt(updatedCompany!.foundedYear, 10) || 0 : (updatedCompany!.foundedYear ?? 0)
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            companySizeStr,
            foundedYearNum,
            updatedCompany!.industry,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            Boolean(updatedCompany!.approved),
            Boolean(updatedCompany!.rejected),
            Boolean(updatedCompany!.suspended),
            updatedCompany!.createdAt,
            updatedCompany!.websiteURL ?? null
        )
    }

    async findById(id: string): Promise<Company | null> {
        const company = await CompanyModel.findByPk(id, { raw: true })
        if (!company) return null
        const companySizeStr = String(company!.companySize)
        const foundedYearNum = typeof company!.foundedYear === 'string' ? parseInt(company!.foundedYear, 10) || 0 : (company!.foundedYear ?? 0)
        return new Company(
            company!.id,
            company!.registeredBy,
            company!.logo,
            company!.name,
            companySizeStr,
            foundedYearNum,
            company!.industry,
            company!.location,
            company!.aboutCompany,
            Boolean(company!.approved),
            Boolean(company!.rejected),
            Boolean(company!.suspended),
            company!.createdAt,
            company!.websiteURL ?? null
        )
    }

    async changeCompanyStatus(company: Company): Promise<Company> {
        const [rowsUpdated, updatedCompanies] = await CompanyModel.update(
            { suspended: !company.suspended },
            {
                where: { id: company.id },
                returning: true
            }
        )
        const updatedCompany = updatedCompanies[0]!.get({ plain: true });
        const companySizeStr = String(updatedCompany!.companySize)
        const foundedYearNum = typeof updatedCompany!.foundedYear === 'string' ? parseInt(updatedCompany!.foundedYear, 10) || 0 : (updatedCompany!.foundedYear ?? 0)
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            companySizeStr,
            foundedYearNum,
            updatedCompany!.industry,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            Boolean(updatedCompany!.approved),
            Boolean(updatedCompany!.rejected),
            Boolean(updatedCompany!.suspended),
            updatedCompany!.createdAt,
            updatedCompany!.websiteURL ?? null
        )
    }

    async approveCompany(id: string): Promise<Company> {
        const [rowsUpdated, updatedCompanies] = await CompanyModel.update(
            {
                approved: true,
                rejectReasons: null
            },
            {
                where: { id: id },
                returning: true,
            }
        )
        const updatedCompany = updatedCompanies[0]!.get({ plain: true });
        const companySizeStr = String(updatedCompany!.companySize)
        const foundedYearNum = typeof updatedCompany!.foundedYear === 'string' ? parseInt(updatedCompany!.foundedYear, 10) || 0 : (updatedCompany!.foundedYear ?? 0)
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            companySizeStr,
            foundedYearNum,
            updatedCompany!.industry,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            Boolean(updatedCompany!.approved),
            Boolean(updatedCompany!.rejected),
            Boolean(updatedCompany!.suspended),
            updatedCompany!.createdAt,
            updatedCompany!.websiteURL ?? null
        )
    }

    async rejectCompany(id: string, reason: string[]): Promise<Company> {
        const [rowsUpdated, updatedCompanies] = await CompanyModel.update(
            {
                rejected: true,
                rejectReasons: reason
            },
            {
                where: { id: id },
                returning: true
            }
        )
        const updatedCompany = updatedCompanies[0]!.get({ plain: true });
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            updatedCompany!.companySize,
            updatedCompany!.foundedYear,
            updatedCompany!.industry,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt,
            updatedCompany!.websiteURL
        )
    }

    async changeRejectedStatus(user: string): Promise<Company> {
        const [rowsUpdated, updatedCompanies] = await CompanyModel.update(
            {
                rejected: false,
                rejectReasons: null
            },
            {
                where: { registeredBy: user },
                returning: true
            }
        )
        const updatedCompany = updatedCompanies[0]!.get({ plain: true });
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            updatedCompany!.companySize,
            updatedCompany!.foundedYear,
            updatedCompany!.industry,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt,
            updatedCompany!.websiteURL
        )
    }

    async deleteCompany(id: string): Promise<{ success: boolean; }> {
        await CompanyModel.destroy({
            where: { id: id }
        })
        return { success: true }
    }

}