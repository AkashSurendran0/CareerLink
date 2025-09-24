import { User } from "../entities/User";

export interface IUserRepository {
    findByEmail(email:string): Promise<User | null>
    create(user: User): Promise<User>
    createUserWithGoogle(email: string, googleId:string, username:string):Promise<User>
    updateUserPassword(email:string, password:string):Promise<User>
    getUsers(page:number, limit:number):Promise<User[]>
    getAllUsersCount(): Promise<number>
    editUserName(id:string, username:string): Promise<User>
}