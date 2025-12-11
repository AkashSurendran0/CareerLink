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

    async getConnectedUsers(id: string, name:string): Promise<any> {
        const result=await this._connectionRepository.findByUser(id);
        let requestCount=await this._connectionRepository.getUserRequests(id);
        requestCount=requestCount.length; 
        let users=[];
        if(result){
            for(let user of result.connections){
                const details=await this._userDetailsRepository.getUserDetails(user);
                const info=await this._userRepository.findById(user);
                if(info?.suspended == false) users.push({id:user, name:info?.username, dp:details?.profilePicture ?? null});
            }  
        }
        if (name && name.trim() !== "") {
            const search = name.toLowerCase();
            users = users.filter(u =>
                u.name?.toLowerCase().startsWith(search)
            );
        }
        return {users, requestCount};
    }

}