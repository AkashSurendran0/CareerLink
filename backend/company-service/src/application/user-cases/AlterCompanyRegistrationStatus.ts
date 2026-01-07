import { IAlterCompanyRegistrationStatus } from "../../domain/use-cases/ICompanyUserCase";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { rabbitmqService } from "../../utils/Rabbitmq";

@injectable()
export class AlterCompanyRegistrationStatus implements IAlterCompanyRegistrationStatus {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository,
    ){}

    async rejectCompany(id:string, reason:string[]):Promise<{success:boolean}> {
            const company=await this._companyRepository.rejectCompany(id, reason);
            await elasticClient.update({
                index:"companies",
                id:id,
                doc:{
                    rejected:true
                }
            });
            await rabbitmqService.publishEvent("company.events", "company.rejected", {
                companyId:company.id,
                companyName:company.name,
                registeredBy:company.registeredBy,
                action:"rejected"
            });
            return {success:true};
    }

    async acceptCompany(id:string):Promise<{success:boolean}> {
        const company=await this._companyRepository.approveCompany(id);
        await elasticClient.update({
            index:"companies",
            id:id,
            doc:{
                approved:true
            }
        });
        await rabbitmqService.publishEvent("company.events", "company.approved", {
            companyId:company.id,
            companyName:company.name,
            registeredBy:company.registeredBy,
            action:"approved"
        });
        return {success:true};
    }

}