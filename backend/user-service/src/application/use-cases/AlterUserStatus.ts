import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class AlterUserStatus {
    private _userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this._userRepository=userRepository
    }

    async changeUserStatus (id:string) {
        const user=await this._userRepository.findById(id)
        const updatedUser=await this._userRepository.alterUserStatus(user)
        return updatedUser
    }

}