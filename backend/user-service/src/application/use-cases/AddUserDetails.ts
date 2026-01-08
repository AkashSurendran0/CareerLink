import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAddUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

type details = {
    gender: string,
    location: string,
    proficiency: string,
    aboutMe: string,
    experience: string,
    skills: string,
    education: string,
    linkedinLink: string,
    githubLink: string
}

@injectable()
export class AddUserDetails implements IAddUserDetails {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository, @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository: IUserDetailsRepository) { }

    async addUserDetails(details: any, email: string): Promise<{ success: boolean }> {
        const user = await this._userRepository.findByEmail(email);
        await this._userDetailsRepository.addUserDetails(user!.id, details);
        return { success: true };
    }
}   