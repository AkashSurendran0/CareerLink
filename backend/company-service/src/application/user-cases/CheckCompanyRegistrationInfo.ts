import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";

@injectable()
export class CheckCompanyRegistrationInfo {
    
    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async CheckCompanyRegistrationInfo (userId:string) {
        console.log(5)
        const result=await this._companyRepository.checkCompany(userId)
        console.log(4)
        return result
    }

}