import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { GetUsers } from "../../domain/use-cases/IUserUseCase";

export class GetAllUsers implements GetUsers {
    public userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
    }

    async getUsers (page:number, limit:number):Promise<{id:string, username:string, email:string, status:boolean, createdAt:Date|undefined}[]> {
        const users=await this.userRepository.getUsers(page, limit)
        const result=users.map(user=>({
            id:user.id,
            username:user.username,
            email:user.email,
            status:user.suspended,
            createdAt:user.createdAt
        }))
        return result
    }

}