import { inject, injectable } from "inversify";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { TYPES } from "../../types";
import { IEditCompany } from "../../domain/use-cases/ICompanyUserCase";

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

    async editCompany (userId:string, details:Details): Promise<{success:boolean}> {
        await this._companyRepository.editCompany(userId, details)
        return {success:true}
    }

}