import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { IGetConnections } from "../../domain/use-cases/IConnectionUseCase";

@injectable()
export class GetConnections implements IGetConnections {

    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository: IUserDetailsRepository,
        @inject(TYPES.IConnectionRepository) private _connectionRepository: IConnectionRepository
    ) { }

    async getUnconnectedUsers(id: string, name: string | undefined): Promise<{ users: { id: string; name?: string; dp?: string | null; pending: boolean }[]; requestCount: number }> {
        let result = name ? await this._userRepository.findByName(name) : await this._userRepository.getAllUsers();
        const connections = await this._connectionRepository.findByUser(id);
        let requestCountArr = await this._connectionRepository.getUserRequests(id);
        const requestCount = requestCountArr.length;

        let unconnectedUsers = result.filter(user => user.id !== id && user.suspended === false);
        if (connections && connections.connections) {
            unconnectedUsers = unconnectedUsers.filter(user => !connections.connections.includes(user.id));
        }

        const users: { id: string; name?: string; dp?: string | null; pending: boolean }[] = [];
        for (const user of unconnectedUsers) {
            const details = await this._userDetailsRepository.getUserDetails(user.id);
            const pending = Boolean(connections && connections.pendings && connections.pendings.includes(user.id));
            users.push({ id: user.id, name: user.username, dp: details?.profilePicture ?? null, pending });
        }

        return { users, requestCount };
    }

}