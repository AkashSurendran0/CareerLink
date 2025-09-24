import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class CheckUserBlock {
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
    }

    async checkUserBlock (id:string): Promise<{success:boolean} | null> {
        console.log('heeeeeeeee')
        const user=await this.userRepository.findById(id)
        if(!user) return null
        return {
            success:user.suspended
        }
    }

}