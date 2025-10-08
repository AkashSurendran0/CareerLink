import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { CompanyMapper } from "../../mapper/CompanyMapper";

@injectable()
export class AlterCompanyStatus {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async changeCompanyStatus (id:string) { 
        const company=await this._companyRepository.findById(id)
        const updatedCompany=await this._companyRepository.changeCompanyStatus(company)
        await elasticClient.update({
            index:'companies',
            id:updatedCompany.id.toString(),
            doc:{
                suspended:updatedCompany.suspended
            }
        })
        await elasticClient.indices.refresh({index:'companies'})
        return CompanyMapper.toDTO(updatedCompany)
    }

}