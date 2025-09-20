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
            userDoc.suspended,
            userDoc.createdAt
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
            userData.suspended,
            userData.createdAt
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
            userData.suspended,
            userData.createdAt
        )
    }

    async updateUserPassword(email:string, password:string): Promise<User> {
        const [rowsUpdated, updatedUsers]= await UserModel.update(
            {password},
            {
                where:{email},
                returning:true
            }
        )
        const updatedUser=updatedUsers[0]!.get({plain:true})
        return new User(
            updatedUser.id.toString(), 
            updatedUser.username, 
            updatedUser.email, 
            updatedUser.password, 
            updatedUser.googleId,
            updatedUser.suspended,
            updatedUser.createdAt
        )
    }

    async getUsers(page: number, limit: number): Promise<User[]> {
        const offset=(page-1)*limit 
        const users=await UserModel.findAll({raw:true, offset, limit}) 
        return users.map((user:any)=> 
            new User( 
                user.id.toString(), 
                user.username, 
                user.email, 
                user.password, 
                user.googleId, 
                user.suspended,
                user.createdAt
            ) 
        )
    }

}