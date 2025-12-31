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
            foundedYear: details.foundedYear,
            industry: details.industry,
            websiteURL: details.websiteURL,
            location: details.location,
            aboutCompany: details.aboutCompany
        })
        const companyData = newCompany.get({ plain: true })
        return new Company(
            companyData!.id,
            companyData!.registeredBy,
            companyData!.logo,
            companyData!.name,
            companyData!.companySize,
            companyData!.foundedYear,
            companyData!.industry,
            companyData!.websiteURL,
            companyData!.location,
            companyData!.aboutCompany,
            companyData!.approved,
            companyData!.rejected,
            companyData!.suspended,
            companyData!.createdAt
        )
    }

    async checkCompany(user: string): Promise<{ success: boolean }> {
        const company = await CompanyModel.findOne({ where: { registeredBy: user } })
        if (company) return { success: true }
        return { success: false }
    }

    async getCompanyDetails(user: string): Promise<Company> {
        const companyDetails = await CompanyModel.findOne({ where: { registeredBy: user }, raw: true })
        return new Company(
            companyDetails!.id,
            companyDetails!.registeredBy,
            companyDetails!.logo,
            companyDetails!.name,
            companyDetails!.companySize,
            companyDetails!.foundedYear,
            companyDetails!.industry,
            companyDetails!.websiteURL || "",
            companyDetails!.location,
            companyDetails!.aboutCompany,
            companyDetails!.approved,
            companyDetails!.rejected,
            companyDetails!.suspended,
            companyDetails!.createdAt,
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
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            updatedCompany!.companySize,
            updatedCompany!.foundedYear,
            updatedCompany!.industry,
            updatedCompany!.websiteURL,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt
        )
    }

    async findById(id: string): Promise<Company | null> {
        const company = await CompanyModel.findByPk(id, { raw: true })
        if (!company) return null
        return new Company(
            company!.id,
            company!.registeredBy,
            company!.logo,
            company!.name,
            company!.companySize,
            company!.foundedYear,
            company!.industry,
            company!.websiteURL || "",
            company!.location,
            company!.aboutCompany,
            company!.approved,
            company!.rejected,
            company!.suspended,
            company!.createdAt
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
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            updatedCompany!.companySize,
            updatedCompany!.foundedYear,
            updatedCompany!.industry,
            updatedCompany!.websiteURL,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt
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
        return new Company(
            updatedCompany!.id,
            updatedCompany!.registeredBy,
            updatedCompany!.logo,
            updatedCompany!.name,
            updatedCompany!.companySize,
            updatedCompany!.foundedYear,
            updatedCompany!.industry,
            updatedCompany!.websiteURL,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt
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
            updatedCompany!.websiteURL,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt
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
            updatedCompany!.websiteURL,
            updatedCompany!.location,
            updatedCompany!.aboutCompany,
            updatedCompany!.approved,
            updatedCompany!.rejected,
            updatedCompany!.suspended,
            updatedCompany!.createdAt
        )
    }

    async deleteCompany(id: string): Promise<{ success: boolean; }> {
        await CompanyModel.destroy({
            where: { id: id }
        })
        return { success: true }
    }

}