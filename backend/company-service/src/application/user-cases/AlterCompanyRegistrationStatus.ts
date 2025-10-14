import { IAlterCompanyRegistrationStatus } from "../../domain/use-cases/ICompanyUserCase";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";

@injectable()
export class AlterCompanyRegistrationStatus implements IAlterCompanyRegistrationStatus {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async alterCompanyRegistrationStatus(code:number, id:string):Promise<{success:boolean} | null> {
        if(code==1){
            const result=await this._companyRepository.approveCompany(id)
            await elasticClient.update({
                index:'companies',
                id:id,
                doc:{
                    approved:true
                }
            })
            return result
        }else if(code==0){
            const result=await this._companyRepository.rejectCompany(id)
            await elasticClient.update({
                index:'companies',
                id:id,
                doc:{
                    rejected:true
                }
            })
            return result
        }
        return null
    }

}