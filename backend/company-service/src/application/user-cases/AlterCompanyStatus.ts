import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { CompanyMapper } from "../../mapper/CompanyMapper";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { IAlterCompanyStatus } from "../../domain/use-cases/ICompanyUserCase";

@injectable()
export class AlterCompanyStatus implements IAlterCompanyStatus {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async changeCompanyStatus (id:string):Promise<CompanyDTO> { 
        const company=await this._companyRepository.findById(id)
        console.log('conpamu', company)
        const updatedCompany=await this._companyRepository.changeCompanyStatus(company)
        console.log('suseee',updatedCompany.suspended)
        await elasticClient.update({
            index:'companies',
            id:updatedCompany.id.toString(),
            doc:{
                suspended:updatedCompany.suspended
            }
        })
        console.log(3)
        await elasticClient.indices.refresh({index:'companies'})
        return CompanyMapper.toDTO(updatedCompany)
    }

}