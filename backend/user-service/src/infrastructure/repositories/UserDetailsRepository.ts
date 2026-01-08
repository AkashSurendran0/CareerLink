import { IUserDetailsRepository, details } from "../../domain/repositories/IUserDetailsRepository";
import { UserDetailsEntity } from "../../domain/entities/UserDetails";
import { UserDetailsModel } from "../models/UserDetailsModel";
import { injectable } from "inversify";

@injectable()
export class UserDetailsRepository implements IUserDetailsRepository {

    async addUserDetails(id: string, details: details): Promise<UserDetailsEntity> {
        const data = {
            user: id,
            ...details
        };
        const newDetails = await UserDetailsModel.create(data);
        return new UserDetailsEntity(
            (newDetails as any)._id.toString(),
            newDetails.user,
            newDetails.profilePicture || "",
            newDetails.gender || "",
            newDetails.aboutMe || "",
            newDetails.location || "",
            newDetails.proficiency || "",
            newDetails.skills || [],
            newDetails.education as any || [],
            newDetails.experience as any || [],
            newDetails.linkedinLink || "",
            newDetails.githubLink || ""
        );
    }

    async getUserDetails(id: string): Promise<UserDetailsEntity | null> {
        const details = await UserDetailsModel.findOne({ user: id });
        if (!details) return null;
        return new UserDetailsEntity(
            (details as any)._id.toString(),
            details.user,
            details.profilePicture || "",
            details.gender || "",
            details.aboutMe || "",
            details.location || "",
            details.proficiency || "",
            details.skills as unknown as string[] || [],
            details.education as any || [],
            details.experience as any || [],
            details.linkedinLink || "",
            details.githubLink || ""
        );
    }

    async editUserDetails(id: string, details: details): Promise<UserDetailsEntity | null> {
        const newDetails = await UserDetailsModel.findOneAndUpdate(
            { user: id },
            { $set: details },
            { new: true, upsert: true }
        );
        if (!newDetails) return null;
        return new UserDetailsEntity(
            (newDetails as any)._id.toString(),
            newDetails.user,
            newDetails.profilePicture || "",
            newDetails.gender || "",
            newDetails.aboutMe || "",
            newDetails.location || "",
            newDetails.proficiency || "",
            newDetails.skills as unknown as string[] || [],
            newDetails.education as any || [],
            newDetails.experience as any || [],
            newDetails.linkedinLink || "",
            newDetails.githubLink || ""
        );

    }

}