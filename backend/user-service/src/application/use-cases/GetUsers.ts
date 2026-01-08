import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetAllUsers } from "../../domain/use-cases/IUserUseCase";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { UserMapper } from "../../mappers/UserMapper";

@injectable()
export class GetAllUsers implements IGetAllUsers {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) { }

    async getUsers(page: number, limit: number, query: string | undefined): Promise<{ result: { id: string, username: string, email: string, status?: boolean, createdAt: Date | undefined }[], pageLimit: number }> {
        const countResponse = await elasticClient.count({
            index: "users",
            query: {
                match_all: {}
            }
        });
        const totalUsers = countResponse.count;
        const pageLimit = Math.ceil(totalUsers / limit);

        let esQuery: Record<string, unknown>;

        if (!query || query.trim() === "") {
            esQuery = { match_all: {} };
        } else {
            esQuery = {
                prefix: {
                    username: query.toLowerCase()
                }
            };
        }

        const users = await elasticClient.search({
            index: "users",
            from: (page - 1) * limit,
            size: limit,
            query: esQuery
        });

        const hits = users.hits.hits.map((hit: any) =>
            hit._source as {
                id: string;
                username: string;
                email: string;
                suspended?: boolean;
                status?: boolean;
                isVip?: boolean;
                createdAt?: Date | string;
            }
        );
        const result = hits.map((user) => UserMapper.toDTO(user));
        return {
            result: result,
            pageLimit: pageLimit
        };
    }

}