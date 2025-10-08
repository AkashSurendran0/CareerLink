import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { IAddCompany } from "../../domain/use-cases/ICompanyUserCase";
import { elasticClient } from "../../utils/ElasticClient";

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
export class AddCompany implements IAddCompany {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async addCompany (userId:string, details:Details): Promise<{success:boolean}> {
        const result=await this._companyRepository.addCompany(userId, details)
        await elasticClient.index({
            index:'companies',
            id:result.id.toString(),
            document:{
                id:result.id,
                logo:result.logo,
                name:result.name,
                createdAt:result.createdAt,
                suspended:result.suspended
            }
        })
        return {success:true}
    }

}