import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { IAddCompany } from "../../domain/use-cases/ICompanyUserCase";

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
        return result
    }

}