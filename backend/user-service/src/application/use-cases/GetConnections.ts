import { inject, injectable } from "inversify";
import { IGetConnections } from "../../domain/use-cases/IUserUseCase";
import { TYPES } from "../../types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IConnectionRepository } from "../../domain/repositories/IConnectionsRepository";

@injectable()
export class GetConnections implements IGetConnections {

    constructor (
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository,
        @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository:IUserDetailsRepository,
        @inject(TYPES.IConnectionRepository) private _connectionRepository:IConnectionRepository
    ) {}

    async getUnconnectedUsers(id: string): Promise<any> {
        const result=await this._userRepository.getAllUsers();
        const connections=await this._connectionRepository.findByUser(id);
        let unconnectedUsers=result.filter(user=>user.id != id);
        unconnectedUsers=unconnectedUsers.filter(user=>!connections?.connections.includes(user.id));
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
        return users;
    }

}