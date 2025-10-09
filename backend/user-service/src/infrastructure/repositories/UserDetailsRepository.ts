import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";
import { UserDetailsEntity } from "../../domain/entities/UserDetails";
import { UserDetailsModel } from "../models/UserDetailsModel";
import {injectable} from "inversify";

type details={
    username:string,
    profilePicture:string,
    gender:string,
    location:string,
    proficiency:string,
    aboutMe:string,
    experience:string,
    skills:string,
    education:string,
    linkedinLink:string,
    githubLink:string
}

@injectable()
export class UserDetailsRepository implements IUserDetailsRepository {
    
    async addUserDetails(id:string, details:details):Promise<UserDetailsEntity> {
        console.log("here babyyy");
        const data={
            user:id,
            ...details
        };
        const newDetails = await UserDetailsModel.insertOne(data);
        return new UserDetailsEntity(
            newDetails.id.toString(),
            newDetails.user,
            newDetails.profilePicture,
            newDetails.gender,
            newDetails.aboutMe,
            newDetails.location,
            newDetails.proficiency,
            newDetails.skills,
            newDetails.education,
            newDetails.experience,
            newDetails.linkedinLink,
            newDetails.githubLink
        );
    }

    async getUserDetails(id:string): Promise<UserDetailsEntity | null> {
        const details=await UserDetailsModel.findOne({user:id});
        if(!details) return null;
        return new UserDetailsEntity(
            details.id.toString(),
            details.user,
            details.profilePicture,
            details.gender,
            details.aboutMe,
            details.location,
            details.proficiency,
            details.skills,
            details.education,
            details.experience,
            details.linkedinLink,
            details.githubLink
        );
    }

    async editUserDetails (id:string, details:details): Promise<UserDetailsEntity | null> {
        const newDetails=await UserDetailsModel.findOneAndUpdate(
            {user:id},
            {$set: details},
            {new:true, upsert:true}
        );
        if(!newDetails) return null;
        return new UserDetailsEntity(
            newDetails.id.toString(),
            newDetails.user,
            newDetails.profilePicture,
            newDetails.gender,
            newDetails.aboutMe,
            newDetails.location,
            newDetails.proficiency,
            newDetails.skills,
            newDetails.education,
            newDetails.experience,
            newDetails.linkedinLink,
            newDetails.githubLink
        );

    } 

}