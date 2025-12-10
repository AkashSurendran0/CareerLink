import { User } from "../entities/User";

type UserType={
    id:string,
    username:string,
    email:string,
    password:string | null,
    googleId:string | null,
    suspended:boolean,
    createdAt:string
}

export interface IUserRepository {
    findByEmail(email:string): Promise<User | null>
    create(user: User): Promise<User>
    createUserWithGoogle(email: string, googleId:string, username:string):Promise<User>
    updateUserPassword(email:string, password:string):Promise<User>
    getUsers(page:number, limit:number):Promise<User[]>
    getAllUsersCount(): Promise<number>
    editUserName(id:string, username:string): Promise<User>
    findById(id:string): Promise<User | null>
    alterUserStatus(user:UserType): Promise<User>
    getAllUsers(): Promise<User[]>
    findByName(name:string): Promise<User[]>
}