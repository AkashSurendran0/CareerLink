import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import {inject, injectable} from 'inversify'
import { TYPES } from "../../types";

type Education = {
    degree: string;
    university: string;
    passingYear: string;
};

type Experience = {
    company: string;
    experience: string;
};

type Details = {
    username: string;
    profilePicture?: string;
    gender:string;
    aboutMe: string;
    location: string,
    proficiency: string,
    skills: string[];
    education: Education[];
    experience: Experience[];
    linkedinLink: string;
    githubLink:string
};

@injectable()
export class GetUserDetails implements IGetUserDetails {

    constructor(@inject(TYPES.IUserRepository) private _userRepository:IUserRepository, @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository:IUserDetailsRepository){}

    async getUserDetails(email:string): Promise<Details | null> {
        const user=await this._userRepository.findByEmail(email)
        if(!user) return null
        const details=await this._userDetailsRepository.getUserDetails(user.id)
        const result={
            username:user.username,
            profilePicture:details?.profilePicture,
            gender:details?.gender,
            aboutMe:details?.aboutMe,
            location:details?.location,
            proficiency:details?.proficiency,
            skills:details?.skills,
            education:details?.education,
            experience:details?.experience,
            linkedinLink:details?.linkedinLink,
            githubLink:details?.githubLink,
        }
        return result
    }

}