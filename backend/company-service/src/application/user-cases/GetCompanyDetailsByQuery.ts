import { inject, injectable } from "inversify";
import { IGetCompanyDetailsByQuery } from "../../domain/use-cases/ICompanyUserCase";
import { TYPES } from "../../types";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { CompanyMapper } from "../../mapper/CompanyMapper";

@injectable()
export class GetCompanyDetailsByQuery implements IGetCompanyDetailsByQuery {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository: ICompanyRepository
    ) { }

    async getCompanyDetails(id: string): Promise<CompanyDTO> {
        const result = await this._companyRepository.findById(id);
        if (!result) throw new Error("Company not found");
        return CompanyMapper.toDTO(result);
    }

}