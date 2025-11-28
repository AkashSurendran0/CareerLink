import { Admin } from "../entities/Admin";

export interface IAdminRepository {
    findAdmin(email:string, password:string): Promise<Admin | null>
    checkAdmin(user:string): Promise<{success:boolean}>
}