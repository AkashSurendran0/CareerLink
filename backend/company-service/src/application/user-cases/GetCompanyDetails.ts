import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { CompanyMapper } from "../../mapper/CompanyMapper";

@injectable()
export class GetCompanyDetails {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}


    async getCompanyDetails (userId:string) {
        const result=await this._companyRepository.getCompanyDetails(userId)
        const company=CompanyMapper.toDTO(result)
        return company
    }
}