import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAddUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";

type details={
    gender:string,
    location:string,
    proficiency:string,
    aboutMe:string,
    experience:string,
    skills:string,
    education:string,
    linkedinLink:string,
    githubLink:string
}

export class AddUserDetails implements IAddUserDetails {
    private _userDetailsRepository:IUserDetailsRepository
    private _userRepository:IUserRepository

    constructor (userDetailsRepository:IUserDetailsRepository, userRepository:IUserRepository) {
        this._userDetailsRepository=userDetailsRepository
        this._userRepository=userRepository
    }

    async addUserDetails(details:details, email:string): Promise<{success:boolean}>{
        const user=await this._userRepository.findByEmail(email)
        await this._userDetailsRepository.addUserDetails(user!.id, details)
        return {success:true}
    }
}   