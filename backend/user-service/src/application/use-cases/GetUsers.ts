import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { GetUsers } from "../../domain/use-cases/IUserUseCase";

export class GetAllUsers implements GetUsers {
    private _userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this._userRepository=userRepository
    }

    async getUsers (page:number, limit:number):Promise<{result: {id:string, username:string, email:string, status:boolean, createdAt:Date|undefined}[], pageLimit:number }> {
        const count=await this._userRepository.getAllUsersCount()
        const pageLimit=Math.ceil(count/limit)
        const users=await this._userRepository.getUsers(page, limit)
        const result=users.map(user=>({
            id:user.id,
            username:user.username,
            email:user.email,
            status:user.suspended,
            createdAt:user.createdAt,
        }))
        return {
            result: result,
            pageLimit: pageLimit
        }
    }

}