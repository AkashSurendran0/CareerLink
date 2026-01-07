import { UserDetailsEntity } from "../entities/UserDetails";

type details = {
    gender?: string | undefined,
    profilePicture?: string | undefined,
    location?: string | undefined,
    aboutMe?: string | undefined,
    experience?: Array<Record<string, unknown>> | undefined,
    skills?: Array<string> | undefined,
    education?: Array<Record<string, unknown>> | undefined,
    linkedinLink?: string | undefined,
    githubLink?: string | undefined
}

export interface IUserDetailsRepository {
    addUserDetails(id: string, details: details): Promise<UserDetailsEntity>
    getUserDetails(id: string): Promise<UserDetailsEntity | null>
    editUserDetails(id: string, details: details): Promise<UserDetailsEntity | null>
}