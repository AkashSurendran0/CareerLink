import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";
import { IGetConnections } from "../../domain/use-cases/IConnectionUseCase";

@injectable()
export class GetConnections implements IGetConnections {

    constructor (
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository,
        @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository:IUserDetailsRepository,
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository
    ) {}

    async getUnconnectedUsers(id: string, name:string): Promise<any> {
        let result;
        if(name) result=await this._userRepository.findByName(name);
        else result=await this._userRepository.getAllUsers();
        const connections=await this._connectionRepository.findByUser(id);
        let requestCount=await this._connectionRepository.getUserRequests(id);
        requestCount=requestCount.length;
        let unconnectedUsers=result.filter(user=>user.id != id);
        unconnectedUsers=unconnectedUsers.filter(user=>user.suspended == false);
        unconnectedUsers=unconnectedUsers.filter(user=>!connections?.connections?.includes(user.id));
        for(let i=0;i<unconnectedUsers.length;i++){
            if(connections?.pendings.includes(unconnectedUsers[i].id)){
                unconnectedUsers[i].pending=true;
            }else{
                unconnectedUsers[i].pending=false;
            }
        }
        let users=[];
        for(let user of unconnectedUsers){
            const details=await this._userDetailsRepository.getUserDetails(user.id);
            users.push({id:user.id, name:user.username, dp:details?.profilePicture ?? null, pending:user.pending});
        }   
        return {users, requestCount};
    }

}