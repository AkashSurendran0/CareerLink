import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEditUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import {inject, injectable} from "inversify";
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
export class EditUserDetails implements IEditUserDetails {

    constructor(@inject(TYPES.IUserRepository) private _userRepository:IUserRepository, @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository:IUserDetailsRepository){}

    async editUserDetails (details:Details, id:string): Promise<{success:boolean}> {
        await this._userRepository.editUserName(id, details.username);
        const updationDetails = {
            profilePicture: details.profilePicture,
            gender: details.gender,
            aboutMe: details.aboutMe,
            location: details.location,
            proficiency: details.proficiency,
            skills: typeof details.skills === "string" ? JSON.parse(details.skills) : details.skills,
            education: typeof details.education === "string" ? JSON.parse(details.education) : details.education,
            experience: typeof details.experience === "string" ? JSON.parse(details.experience) : details.experience,
            linkedinLink: details.linkedinLink,
            githubLink: details.githubLink,
        };
        await this._userDetailsRepository.editUserDetails(id, updationDetails);
        return {success:true};
    }

}