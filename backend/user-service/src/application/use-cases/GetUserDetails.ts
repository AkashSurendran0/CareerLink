import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";

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

export class GetUserDetails implements IGetUserDetails {
    private _userDetailsRepository:IUserDetailsRepository
    private _userRepository:IUserRepository

    constructor(userDetailsRepository:IUserDetailsRepository, userRepository:IUserRepository){
        this._userDetailsRepository=userDetailsRepository
        this._userRepository=userRepository
    }

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