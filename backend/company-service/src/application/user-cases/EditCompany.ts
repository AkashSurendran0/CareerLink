import { inject, injectable } from "inversify";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { TYPES } from "../../types";
import { IEditCompany } from "../../domain/use-cases/ICompanyUserCase";
import { elasticClient } from "../../utils/ElasticClient";

type Details = {
    registeredBy:string,
    logo:string | null,
    companyName:string,
    companySize:string,
    foundedYear:number,
    industry:string,
    websiteURL:string | null,
    location:string,
    aboutCompany:string
}

@injectable()
export class EditCompany implements IEditCompany {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async editCompany (user:string, details:Details): Promise<{success:boolean}> {
        const company=await this._companyRepository.editCompany(user, details)
        if(company.rejected){
            await this._companyRepository.changeRejectedStatus(user)
            await elasticClient.update({
                index:'companies',
                id:company.id,
                doc:{
                    rejected:false
                }
            })
        }
        await elasticClient.update({
            index:'companies',
            id:company.id,
            doc:{
                logo:company.logo,
                name:company.name,
            }
        })
        return {success:true}
    }

}