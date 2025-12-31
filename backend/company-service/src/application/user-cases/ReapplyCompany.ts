import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { IReapplyCompany } from "../../domain/use-cases/ICompanyUserCase";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { CompanyMapper } from "../../mapper/CompanyMapper";
import { elasticClient } from "../../utils/ElasticClient";

@injectable()
export class ReapplyCompany implements IReapplyCompany {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository: ICompanyRepository
    ) { }

    async reapplyCompany(user: string): Promise<CompanyDTO> {
        const company = await this._companyRepository.changeRejectedStatus(user)
        await elasticClient.update({
            index: 'companies',
            id: company.id,
            doc: {
                rejected: false
            }
        })
        return CompanyMapper.toDTO(company)
    }

}