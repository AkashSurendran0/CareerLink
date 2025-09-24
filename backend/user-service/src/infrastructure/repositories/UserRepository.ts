import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../models/UserModel";

type UserType={
    id:string,
    username:string,
    email:string,
    password:string | null,
    googleId:string | null,
    suspended:boolean,
    createdAt:string
}

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

    async getAllUsersCount(): Promise<number> {
        const users=await UserModel.findAll({raw:true})
        return users.length
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
    
    async editUserName(id:string, username:string): Promise<User> {
        const [rowsUpdated, updatedUsers]=await UserModel.update(
            {username},
            {
                where:{id},
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

    async findById(id: string): Promise<User | null> {
        const user=await UserModel.findByPk(id, {raw:true})
        console.log(user)
        if(!user) return null
        return new User (
            user.id.toString(), 
            user.username, 
            user.email, 
            user.password, 
            user.googleId, 
            user.suspended,
            user.createdAt
        )
    }

    async alterUserStatus(user:UserType): Promise<User> {
        const [rowsUpdated, updatedUsers]=await UserModel.update(
            {suspended: !user.suspended},
            {
                where:{id:user.id},
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

}