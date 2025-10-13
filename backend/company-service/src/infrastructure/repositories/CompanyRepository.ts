import { Company } from "../../domain/entities/Company";
import { CompanyModel } from "../models/CompanyModel";
import { injectable } from "inversify";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";

type Details = {
    registeredBy:string,
    logo:string,
    companyName:string,
    companySize:string,
    foundedYear:number,
    industry:string,
    websiteURL:string | null,
    location:string,
    aboutCompany:string
}

@injectable()
export class CompanyRepository implements ICompanyRepository {
    
    async addCompany(userId:string, details:Details): Promise<Company> {
        const newCompany=await CompanyModel.create({
            registeredBy:userId,
            logo:details.logo,
            name:details.companyName,
            companySize:details.companySize,
            foundedYear:details.foundedYear,
            industry:details.industry,
            websiteURL:details.websiteURL,
            location:details.location,
            aboutCompany:details.aboutCompany
        })
        const companyData=newCompany.get({plain:true})
        return new Company (
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
            companyData!.suspended,
            companyData!.rejected,
            companyData!.createdAt
        )
    }

    async checkCompany (userId:string): Promise<{success:boolean}> {
        const company=await CompanyModel.findOne({where: {registeredBy:userId}})
        if(company) return {success:true}
        return {success:false}
    }

    async getCompanyDetails (userId:string): Promise<Company> {
        const companyDetails=await CompanyModel.findOne({where: {registeredBy:userId}, raw:true})
        return new Company (
            companyDetails!.id,
            companyDetails!.registeredBy,
            companyDetails!.logo,
            companyDetails!.name,
            companyDetails!.companySize,
            companyDetails!.foundedYear,
            companyDetails!.industry,
            companyDetails!.websiteURL,
            companyDetails!.location,
            companyDetails!.aboutCompany,
            companyDetails!.approved,
            companyDetails!.suspended,
            companyDetails!.rejected,
            companyDetails!.createdAt
        )
    }

    async editCompany (userId:string, details:Details): Promise<{success:boolean}> {
        await CompanyModel.update(
            details,
            {where:{registeredBy:userId}}            
        )
        return {success:true}
    }

    async findById (id:string):Promise<Company | null> {
        const company=await CompanyModel.findByPk(id, {raw:true})
        if(!company) return null
        return new Company (
            company!.id,
            company!.registeredBy,
            company!.logo,
            company!.name,
            company!.companySize,
            company!.foundedYear,
            company!.industry,
            company!.websiteURL,
            company!.location,
            company!.aboutCompany,
            company!.approved,
            company!.suspended,
            company!.rejected,
            company!.createdAt
        )
    }

    async changeCompanyStatus (company:Company): Promise<Company> {
        console.log(company, 55)
        const [rowsUpdated, updatedCompanies]=await CompanyModel.update(
            {suspended:!company.suspended},
            {
                where:{id:company.id},
                returning:true
            }
        )
        console.log(updatedCompanies, 66)
        const updatedCompany=updatedCompanies[0]!.get({plain:true});
        return new Company (
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
            updatedCompany!.suspended,
            updatedCompany!.rejected,
            updatedCompany!.createdAt
        )
    }

}