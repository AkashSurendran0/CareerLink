import { injectable } from "inversify";
import { IGetAvailableCompanies } from "../../domain/use-cases/ICompanyUserCase";
import { CompanyDTO } from "../../dto/CompanyDTO";
import { elasticClient } from "../../utils/ElasticClient";
import { CompanyMapper } from "../../mapper/CompanyMapper";

@injectable()
export class GetAvailableCompanies implements IGetAvailableCompanies {

    async getAvailableCompanies(email: string, query: string): Promise<CompanyDTO[]> {
        let esQuery:any
        if (!query || query.trim() === "") {
            esQuery = {
                bool: {
                must: [{ match_all: {} }],
                filter: [
                    { term: { approved: true } },
                    { term: { rejected: false } }
                ]
                }
            };
        } else {
            esQuery = {
                bool: {
                must: [
                    {
                    wildcard: {
                        "name.keyword": `*${query.toLowerCase()}*`
                    }
                    }
                ],
                filter: [
                    { term: { approved: true } },
                    { term: { rejected: false } }
                ]
                }
            };
        }
        const indexExists = await elasticClient.indices.exists({
            index: 'companies'
        });
        if (!indexExists) {
            console.log("companies index not found, returning empty array");
            return [];
        }
        const companies=await elasticClient.search({
            index:'companies',
            query:esQuery
        })
        
        let hits=companies.hits.hits.map((hit:any)=>hit._source)
        console.log(hits)
        hits=hits.filter((comp)=>comp.registeredBy != email)
        const result=hits.map((company:any)=>CompanyMapper.toDTO(company))
        return result 
    }

} 