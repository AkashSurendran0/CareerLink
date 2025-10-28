import { ICheckCompanyDetails } from "../../domain/use-cases/ICompanyUserCase";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { CompanyMapper } from "../../mapper/CompanyMapper";

@injectable()
export class CheckCompanyDetails implements ICheckCompanyDetails {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async getCompanyInfo (id:string): Promise<CompanyDTO> {
        const result=await this._companyRepository.findById(id)
        return CompanyMapper.toDTO(result)
    }

}