import { IAdminLogin } from "../../domain/use-cases/IAdminLogin";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import {injectable, inject} from 'inversify'
import { TYPES } from "../../types";
import { createAccessToken, createRefreshToken } from "../../utils/SetToken";

@injectable()
export class AdminLogin implements IAdminLogin {

    constructor(@inject(TYPES.IAdminRepository) private _adminRepository:IAdminRepository){}

    async findAdmin(email: string, password: string): Promise<{ success: true; accessToken: string; refreshToken: string; } | { success: boolean; message: string; }> {
        const admin=await this._adminRepository.findAdmin(email, password)
        if(!admin){
            return {
                success: false, 
                message: 'Invalid Credentials'
            }
        }
        const accessToken=await createAccessToken(admin.id, email)
        const refreshToken=await createRefreshToken(admin.id, email)
        return {
            success: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

}