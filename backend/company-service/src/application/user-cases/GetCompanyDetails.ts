import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { CompanyMapper } from "../../mapper/CompanyMapper";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { IGetCompanyDetails } from "../../domain/use-cases/ICompanyUserCase";

@injectable()
export class GetCompanyDetails implements IGetCompanyDetails {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}


    async getCompanyDetails (user:string):Promise<CompanyDTO> {
        const result=await this._companyRepository.getCompanyDetails(user)
        console.log('result', result)
        const company=CompanyMapper.toDTO(result)
        console.log('dto', company)
        return company
    }
}