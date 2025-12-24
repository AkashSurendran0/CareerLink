import { injectable } from "inversify";
import { IGetActiveCompanyCount } from "../../domain/use-cases/ICompanyUserCase";
import { elasticClient } from "../../utils/ElasticClient";

@injectable()
export class GetActiveCompanyCount implements IGetActiveCompanyCount {

    async getActiveCompanyCount(): Promise<number> {
        const countResponse = await elasticClient.count({
                index: "companies",
                query: {
                    term: {
                        suspended:false
                    }
                }
            }); 
        const totalUsers = countResponse.count;
        return totalUsers;
    }

}