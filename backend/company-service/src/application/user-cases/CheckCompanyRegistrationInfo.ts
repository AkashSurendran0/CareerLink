import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { ICheckCompanyRegistrationInfo } from "../../domain/use-cases/ICompanyUserCase";

@injectable()
export class CheckCompanyRegistrationInfo implements ICheckCompanyRegistrationInfo {
    
    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async checkCompanyRegistrationInfo (user:string):Promise<{success:boolean, rejected:boolean} | {success:boolean}> {
        const result=await this._companyRepository.checkCompany(user)
        return result
    }

}