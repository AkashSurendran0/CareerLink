import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../models/UserModel";

export class UserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const userDoc=await UserModel.findOne({where: {email}, raw:true})
        console.log(userDoc, 'userdoc')
        if(!userDoc) return null
        return new User(
            userDoc.id.toString(), 
            userDoc.username, 
            userDoc.email, 
            userDoc.password, 
            userDoc.suspended
        )
    }

    async create(user: User): Promise<User> {
        const userDoc=await UserModel.create({
            username:user.username, 
            email: user.email, 
            password:user.password,
            suspended: user.suspended ?? false
        })
        return new User(
            userDoc.id.toString(), 
            userDoc.username, 
            userDoc.email, 
            userDoc.password, 
            userDoc.suspended
        )
    }

}