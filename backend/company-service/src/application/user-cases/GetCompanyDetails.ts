import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { CompanyMapper } from "../../mapper/CompanyMapper";
import { CompanyDTO } from "../../dto/CompanyDTO";

@injectable()
export class GetCompanyDetails {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}


    async getCompanyDetails (userId:string):Promise<CompanyDTO> {
        const result=await this._companyRepository.getCompanyDetails(userId)
        const company=CompanyMapper.toDTO(result)
        return company
    }
}