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

    async getApprovedCompanies (page:number, limit:number, query:string | undefined):Promise<{result: {id:string, logo:string, name:string, createdAt:Date, suspended:boolean}[], pageLimit:number}> {
        const approvedCompanies=await elasticClient.count({
            index:'companies',
            query:{
                bool:{
                    must:[
                        {term:{rejected:false}},
                        {term:{approved:true}}
                    ]
                }
            }
        })
        
        const totalApprovedCompanies=approvedCompanies.count
        const approvedPageLimit=Math.ceil(totalApprovedCompanies/limit)

        let esQuery:any

        if(!query || query.trim()==''){
            esQuery={
                bool:{
                    must:[
                        {match_all:{}}
                    ],
                    filter:[
                        {term:{approved:true}},
                        {term:{rejected:false}}
                    ]
                }
            }
        }else{
            esQuery={
                bool:{
                    must:[
                        {       
                            prefix: {
                                name: query.toLowerCase()
                            }
                        }
                    ],
                    filter:[
                        {term:{approved:true}},
                        {term:{rejected:false}}
                    ]
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
            pageLimit:approvedPageLimit
        }
    }

    async getPendingCompanies (page:number, limit:number, query:string | undefined):Promise<{result: {id:string, logo:string, name:string, createdAt:Date, suspended:boolean}[], pageLimit:number}> {
        const pendingCompanies=await elasticClient.count({
            index:'companies',
            query:{
                bool:{
                    must:[
                        {match:{rejected:false}},
                        {match:{approved:false}}
                    ]
                }
            }
        })

        const totalPendingCompanies=pendingCompanies.count
        const pendingPageLimit=Math.ceil(totalPendingCompanies/limit)

        let esQuery:any

        if(!query || query.trim()==''){
            esQuery={
                bool:{
                    must:[
                        {match_all:{}}
                    ],
                    filter:[
                        {term:{approved:false}},
                        {term:{rejected:false}}
                    ]
                }
            }
        }else{
            esQuery={
                bool:{
                    must:[
                        {       
                            prefix: {
                                name: query.toLowerCase()
                            }
                        }
                    ],
                    filter:[
                        {term:{approved:true}},
                        {term:{rejected:false}}
                    ]
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
            pageLimit:pendingPageLimit
        }
    }

}