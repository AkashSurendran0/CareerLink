import { UserDetailsEntity } from "../entities/UserDetails";

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

export interface IUserDetailsRepository {
    addUserDetails(id:string, details:details):Promise<UserDetailsEntity>
}