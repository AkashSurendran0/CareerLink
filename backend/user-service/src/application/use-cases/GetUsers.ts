import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetAllUsers } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";

@injectable()
export class GetAllUsers implements IGetAllUsers {

    constructor(@inject(TYPES.IUserRepository) private _userRepository:IUserRepository){}

    async getUsers (page:number, limit:number, query:string | undefined):Promise<{result: {id:string, username:string, email:string, status:boolean, createdAt:Date|undefined}[], pageLimit:number }> {
        const count=await this._userRepository.getAllUsersCount();
        const pageLimit=Math.ceil(count/limit);
        // const users=await this._userRepository.getUsers(page, limit);
        let esQuery: any;

        if (!query || query.trim() === "") {
            esQuery = { match_all: {} };
        } else {
            esQuery = {
                multi_match: {
                query: query,
                fields: ["username"],
                fuzziness: "AUTO"
                }
            };
        }

        const users = await elasticClient.search({
            index: "users",
            from: (page - 1) * limit,
            size: limit,
            query: esQuery
        });

        const hits=users.hits.hits.map((hit:any)=>hit._source);
        const result=hits.map(user=>({
            id:user.id, 
            username:user.username,
            email:user.email,
            status:user.suspended,
            createdAt:user.createdAt,
        }));
        return {
            result: result,
            pageLimit: pageLimit
        };
    }

}