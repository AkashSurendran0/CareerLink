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

}