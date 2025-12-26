import { User } from "@careerlink/types";

type UserType = {
    id: string,
    username: string,
    email: string,
    password: string | null,
    googleId: string | null,
    suspended: boolean,
    createdAt: Date | undefined
}

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>
    create(user: User): Promise<User>
    createUserWithGoogle(email: string, googleId: string, username: string): Promise<User>
    updateUserPassword(email: string, password: string): Promise<User>
    getUsers(page: number, limit: number): Promise<User[]>
    getAllUsersCount(): Promise<number>
    editUserName(id: string, username: string): Promise<User>
    findById(id: string): Promise<User | null>
    alterUserStatus(user: User): Promise<User>
    getAllUsers(): Promise<User[]>
    findByName(name: string): Promise<User[]>
    getUserAnalytics(): Promise<any>
}