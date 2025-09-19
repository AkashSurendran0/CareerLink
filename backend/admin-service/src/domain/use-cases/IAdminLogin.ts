export interface IAdminLogin {
    findAdmin (email:string, password:string): Promise<{success:boolean, message:string} | {success:true, token:string}>
}