import { inject, injectable } from "inversify";
import { IGetConnectedUsers } from "../../domain/use-cases/IConnectionUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";

@injectable()
export class GetConnectedUsers implements IGetConnectedUsers {

    constructor (
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository,
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository,
        @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository:IUserDetailsRepository,
    ) {}

    async getConnectedUsers(id: string, name:string): Promise<{ users: { id: string; name?: string; dp?: string | null }[]; requestCount: number }> {
        const result = await this._connectionRepository.findByUser(id);
        const requestArr = await this._connectionRepository.getUserRequests(id);
        const requestCount = requestArr.length;
        const users: { id: string; name?: string; dp?: string | null }[] = [];

        if (result) {
            for (const userId of result.connections) {
                const details = await this._userDetailsRepository.getUserDetails(userId);
                const info = await this._userRepository.findById(userId);
                if (info?.suspended === false) users.push({ id: userId, name: info?.username, dp: details?.profilePicture ?? null });
            }
        }

        if (name && name.trim() !== "") {
            const search = name.toLowerCase();
            return { users: users.filter(u => u.name?.toLowerCase().startsWith(search)), requestCount };
        }

        return { users, requestCount };
    }

}