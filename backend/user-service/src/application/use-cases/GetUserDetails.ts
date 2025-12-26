import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IGetUserDetails } from "../../domain/use-cases/IUserDetailsUseCase";
import { inject, injectable } from "inversify";
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
    profilePicture?: string | undefined;
    gender?: string | undefined;
    aboutMe?: string | undefined;
    location?: string | undefined,
    proficiency?: string | undefined,
    skills?: string[] | undefined;
    education?: Education[] | undefined;
    experience?: Experience[] | undefined;
    linkedinLink?: string | undefined;
    githubLink?: string | undefined
};

@injectable()
export class GetUserDetails implements IGetUserDetails {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository, @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository: IUserDetailsRepository) { }

    async getUserDetails(id: string): Promise<Details | null> {
        const user = await this._userRepository.findById(id);
        if (!user) return null;
        const details = await this._userDetailsRepository.getUserDetails(user.id);
        const result = {
            username: user.username,
            profilePicture: details?.profilePicture,
            gender: details?.gender,
            aboutMe: details?.aboutMe,
            location: details?.location,
            proficiency: details?.proficiency,
            skills: typeof details?.skills === "string" ? JSON.parse(details.skills) : details?.skills,
            education: typeof details?.education === "string" ? JSON.parse(details.education) : details?.education,
            experience: typeof details?.experience === "string" ? JSON.parse(details.experience) : details?.experience,
            linkedinLink: details?.linkedinLink,
            githubLink: details?.githubLink,
        };
        return result;
    }

}