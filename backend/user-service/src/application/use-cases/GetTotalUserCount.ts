import { injectable } from "inversify";
import { IGetTotalUserCount } from "../../domain/use-cases/IUserUseCase";
import { elasticClient } from "../../utils/ElasticClient";

@injectable()
export class GetTotalUserCount implements IGetTotalUserCount {

    async getTotalUserCount(): Promise<number> {
        const countResponse = await elasticClient.count({
                index: "users",
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