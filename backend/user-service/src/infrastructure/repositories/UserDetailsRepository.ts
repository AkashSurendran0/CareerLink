import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { UserDetailsEntity } from "../../domain/entities/UserDetails";
import { UserDetailsModel } from "../models/UserDetailsModel";

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

export class UserDetailsRepository implements IUserDetailsRepository {
    
    async addUserDetails(id:string, details:details):Promise<UserDetailsEntity> {
        console.log('here babyyy')
        const data={
            user:id,
            ...details
        }
        const newDetails = await UserDetailsModel.insertOne(data)
        return new UserDetailsEntity(
            newDetails.id.toString(),
            newDetails.user,
            newDetails.profilePicture,
            newDetails.gender,
            newDetails.aboutMe,
            newDetails.skills,
            newDetails.education,
            newDetails.experience,
            newDetails.linkedinLink,
            newDetails.githubLink
        )
    }

}