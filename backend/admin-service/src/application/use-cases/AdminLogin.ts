import { IAdminLogin } from "../../domain/use-cases/IAdminLogin";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import jwt from 'jsonwebtoken'
import {injectable, inject} from 'inversify'
import { TYPES } from "../../types";

@injectable()
export class AdminLogin implements IAdminLogin {

    constructor(@inject(TYPES.IAdminRepository) private _adminRepository:IAdminRepository){}

    async findAdmin(email: string, password: string): Promise<{ success: boolean; message: string; } | { success: true; token: string; }> {
        console.log('reacheddddd')
        const admin=await this._adminRepository.findAdmin(email, password)
        if(!admin){
            return {
                success: false, 
                message: 'Invalid Credentials'
            }
        }
        const token=jwt.sign(
            {id:admin.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )
        return {
            success: true,
            token: token
        }
    }

}