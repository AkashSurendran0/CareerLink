import { inject, injectable } from "inversify";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { TYPES } from "../../types";

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
export class EditCompany {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async editCompany (userId:string, details:Details): Promise<{success:boolean}> {
        await this._companyRepository.editCompany(userId, details)
        return {success:true}
    }

}