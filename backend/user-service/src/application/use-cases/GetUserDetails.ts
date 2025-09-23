import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

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
    aboutMe: string;
    location: string,
    proficiency: string,
    skills: string[];
    education: Education[];
    experience: Experience[];
    linkedin: string;
};

export class GetUserDetails {
    private userDetailsRepository:IUserDetailsRepository
    private userRepository:IUserRepository

    constructor(userDetailsRepository:IUserDetailsRepository, userRepository:IUserRepository){
        this.userDetailsRepository=userDetailsRepository
        this.userRepository=userRepository
    }

    async getUserDetails(email:string): Promise<Details | null> {
        const user=await this.userRepository.findByEmail(email)
        if(!user) return null
        const details=await this.userDetailsRepository.getUserDetails(user.id)
        console.log('user', user)
        console.log('details', details)
        const result={
            username:user.username,
            profilePicture:details?.profilePicture,
            aboutMe:details?.aboutMe,
            location:details?.location,
            proficiency:details?.proficiency,
            skills:details?.skills,
            education:details?.education,
            experience:details?.experience,
            linkedin:details?.linkedinLink,
        }
        return result
    }

}