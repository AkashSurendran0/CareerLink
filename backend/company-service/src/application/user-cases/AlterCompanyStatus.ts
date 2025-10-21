import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { CompanyMapper } from "../../mapper/CompanyMapper";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { IAlterCompanyStatus } from "../../domain/use-cases/ICompanyUserCase";
import { rabbitmqService } from "../../utils/Rabbitmq";

@injectable()
export class AlterCompanyStatus implements IAlterCompanyStatus {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async changeCompanyStatus (id:string):Promise<CompanyDTO> { 
        const company=await this._companyRepository.findById(id)
        const updatedCompany=await this._companyRepository.changeCompanyStatus(company)
        await elasticClient.update({
            index:'companies',
            id:updatedCompany.id.toString(),
            doc:{
                suspended:updatedCompany.suspended
            }
        })
        if(updatedCompany.suspended){
            await rabbitmqService.publishEvent("company.events", "company.blocked", {
                companyId:updatedCompany.id,
                companyName:updatedCompany.name,
                registeredBy:updatedCompany.registeredBy,
                action:'blocked'
            })
        }else if(!updatedCompany.suspended){
            await rabbitmqService.publishEvent("company.events", "company.unblocked", {
                companyId:updatedCompany.id,
                companyName:updatedCompany.name,
                registeredBy:updatedCompany.registeredBy,
                action:'unblocked'
            })
        }
        await elasticClient.indices.refresh({index:'companies'})
        return CompanyMapper.toDTO(updatedCompany)
    }

}