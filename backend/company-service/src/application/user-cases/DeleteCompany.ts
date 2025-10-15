import { injectable, inject } from "inversify";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { IDeleteCompany } from "../../domain/use-cases/ICompanyUserCase";

@injectable()
export class DeleteCompany implements IDeleteCompany {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async deleteCompany (id:string):Promise<{success:boolean}> {
        const result=await this._companyRepository.deleteCompany(id)
        await elasticClient.delete({
            index:'companies',
            id:id
        })
        return result
    }

}