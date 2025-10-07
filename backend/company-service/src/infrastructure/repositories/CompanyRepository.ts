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
    
    async addCompany(userId:string, details:Details): Promise<{success:boolean}> {
        console.log(20)
        console.log(details)
        await CompanyModel.create({
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
        console.log(21)
        return {success:true}
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
            companyDetails!.suspended,
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

}