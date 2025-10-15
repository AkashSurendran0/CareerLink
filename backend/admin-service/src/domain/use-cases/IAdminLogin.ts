export interface IAdminLogin {
    findAdmin (email:string, password:string): Promise<{success:true, accessToken: string; refreshToken: string; } | {success:boolean, message:string}>
}