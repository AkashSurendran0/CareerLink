import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAddUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";

type details={
    gender:string,
    location:string,
    aboutMe:string,
    experience:string,
    skills:string,
    education:string,
    linkedinLink:string,
    githubLink:string
}

export class AddUserDetails implements IAddUserDetails {
    private userDetailsRepository:IUserDetailsRepository
    private userRepository:IUserRepository

    constructor (userDetailsRepository:IUserDetailsRepository, userRepository:IUserRepository) {
        this.userDetailsRepository=userDetailsRepository
        this.userRepository=userRepository
    }

    async addUserDetails(details:details, email:string): Promise<{success:boolean}>{
        const user=await this.userRepository.findByEmail(email)
        await this.userDetailsRepository.addUserDetails(user!.id, details)
        return {success:true}
    }
}   