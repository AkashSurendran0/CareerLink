import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { GetUsers } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from 'inversify'
import { TYPES } from "../../types";

@injectable()
export class GetAllUsers implements GetUsers {

    constructor(@inject(TYPES.IUserRepository) private _userRepository:IUserRepository){}

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