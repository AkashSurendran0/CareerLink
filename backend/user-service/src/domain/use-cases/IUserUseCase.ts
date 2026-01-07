import { UserDTO } from "../../dto/UserDTO";

export interface IChangePass {
    changePass(email: string, password: string): Promise<{ token: string, refreshToken: String }>
}

export interface ISendResetOtp {
    mailOtp(email: string): Promise<{ success: boolean, message: string } | { success: boolean}>
}

export interface IGoogleLogin {
    googleSignin(email: string, googleId: string, username: string): Promise<UserDTO>
}

export interface ILoginUser {
    execute(email: string, password: string): Promise<{ success: boolean, token: string, refreshToken: string } | { success: boolean, message: string }>
}

export interface ISignupUser {
    createUser(username: string, email: string, password: string): Promise<{ success: boolean, token: string, refreshToken: String } | { success: boolean, message: string }>
}

export interface ISendOTP {
    mailOtp(email: string): Promise<{ success: boolean} | { success: boolean, message: string }>
}

export interface IGetAllUsers {
    getUsers(page: number, limit: number, query: string | undefined): Promise<{ result: { id: string, username: string, email: string, status?: boolean, createdAt: Date | undefined }[], pageLimit: number }>
}

export interface IVerifyOTP {
    verifyOtp(email: string, otp:string): Promise<{ success: boolean, match: boolean } | { success: boolean, message: string }>
}

export interface IAlterUserStatus {
    changeUserStatus(id: string): Promise<UserDTO>
}

export interface ICheckUserBlock {
    checkUserBlock(id: string): Promise<{ success: boolean } | null>
}

export interface IGetUserNames {
    getUserNames(id: string): Promise<{ result: import("../../domain/entities/User").User | null; pfp?: string | null }>
    getUserNamesByEmail(email: string): Promise<{ result: import("../../domain/entities/User").User | null; pfp?: string | null }>
    getUserInfo(email: string): Promise<import("../../domain/entities/User").User | null>
}

export interface ISendWarningMail {
    sendWarningMail(email: string): Promise<{ success: boolean }>
}

export interface IGetUserAnalytics {
    getUserAnalytics(): Promise<Array<{ month: string; count: number }>>
}

export interface IGetTotalUserCount {
    getTotalUserCount(): Promise<number>
}