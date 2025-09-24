import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class AlterUserStatus {
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
    }

    async changeUserStatus (id:string) {
        const user=await this.userRepository.findById(id)
        const updatedUser=await this.userRepository.alterUserStatus(user)
        return updatedUser
    }

}