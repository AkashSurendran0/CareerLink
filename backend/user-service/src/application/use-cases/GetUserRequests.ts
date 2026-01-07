import { inject, injectable } from "inversify";
import { IGetUserRequests } from "../../domain/use-cases/IConnectionUseCase";
import { TYPES } from "../../types";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";

@injectable()
export class GetUserRequests implements IGetUserRequests {

    constructor(
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository,
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository,
        @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository:IUserDetailsRepository,
    ){}

    async getUserRequests(id: string, name:string): Promise<{ users: { id: string; name?: string; dp?: string | null }[]; requestCount: number }> {
        const requests = await this._connectionRepository.getUserRequests(id);
        const requestCount = requests.length;
        const users: { id: string; name?: string; dp?: string | null }[] = [];
        for (const r of requests) {
            const details = await this._userDetailsRepository.getUserDetails(r.user);
            const info = await this._userRepository.findById(r.user);
            if (info?.suspended === false) users.push({ id: r.user, name: info?.username, dp: details?.profilePicture ?? null });
        }
        if (name && name.trim() !== "") {
            const search = name.toLowerCase();
            return { users: users.filter(u => u.name?.toLowerCase().startsWith(search)), requestCount };
        }
        return { users, requestCount };
    }

}