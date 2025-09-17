import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../models/UserModel";

export class UserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const userDoc=await UserModel.findOne({where: {email}, raw:true})
        if(!userDoc) return null
        return new User(
            userDoc.id.toString(), 
            userDoc.username, 
            userDoc.email, 
            userDoc.password,
            userDoc.googleId, 
            userDoc.suspended
        )
    }

    async create(user: User): Promise<User> {
        const userDoc=await UserModel.create({
            username:user.username, 
            email: user.email, 
            password:user.password,
        })
        const userData=userDoc.get({plain:true})
        return new User(
            userData.id.toString(), 
            userData.username, 
            userData.email, 
            userData.password, 
            userData.googleId,
            userData.suspended
        )
    }

    async createUserWithGoogle(email: string, googleId: string, username: string): Promise<User> {
        const user=await UserModel.create({
            username: username, 
            email: email,
            googleId: googleId
        })
        const userData=user.get({plain:true})
        return new User(
            userData.id.toString(), 
            userData.username, 
            userData.email, 
            userData.password, 
            userData.googleId,
            userData.suspended
        )
    }

}