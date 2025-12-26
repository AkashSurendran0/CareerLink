import { UserDetailsEntity } from "@careerlink/types";

type details = {
    gender?: string | undefined,
    profilePicture?: string | undefined,
    location?: string | undefined,
    aboutMe?: string | undefined,
    experience?: any | undefined,
    skills?: any | undefined,
    education?: any | undefined,
    linkedinLink?: string | undefined,
    githubLink?: string | undefined
}

export interface IUserDetailsRepository {
    addUserDetails(id: string, details: details): Promise<UserDetailsEntity>
    getUserDetails(id: string): Promise<UserDetailsEntity | null>
    editUserDetails(id: string, details: details): Promise<UserDetailsEntity | null>
}