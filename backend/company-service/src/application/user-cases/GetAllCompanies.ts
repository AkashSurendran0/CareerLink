import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { CompanyMapper } from "../../mapper/CompanyMapper";
import { IGetAllCompanies } from "../../domain/use-cases/ICompanyUserCase";

@injectable()
export class GetAllCompanies implements IGetAllCompanies {

    constructor(
        @inject(TYPES.ICompanyRepository) private _companyRepository:ICompanyRepository
    ){}

    async getAllCompanies (page:number, limit:number, query:string | undefined):Promise<{result: {id:string, logo:string, name:string, createdAt:Date, suspended:boolean}[], pageLimit:number}> {
        const countResponse=await elasticClient.count({
            index:'companies',
            query:{
                match_all:{}
            }
        })
        const totalCompanies=countResponse.count
        const pageLimit=Math.ceil(totalCompanies/limit)

        let esQuery:any

        if(!query || query.trim()==''){
            esQuery={match_all:{}}
        }else{
            esQuery={
                multi_match:{
                    query:query,
                    fields:["name"],
                    fuzziness:"AUTO"
                }
            }
        }

        const companies=await elasticClient.search({
            index:'companies',
            from:(page-1)*limit,
            size:limit,
            query:esQuery
        })

        const hits=companies.hits.hits.map((hit:any)=>hit._source)
        const result=hits.map((company:any)=>CompanyMapper.toDTO(company))
        return {
            result:result,
            pageLimit:pageLimit
        }
    }

}