import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
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
export class AddCompany {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async addCompany (userId:string, details:Details) {
        console.log(10)
        const result=await this._companyRepository.addCompany(userId, details)
        console.log(11)
        return result
    }

}