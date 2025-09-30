import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel } from "../models/AdminModel";

export class AdminRepository implements IAdminRepository {

    async findAdmin (email:string, password:string): Promise<Admin | null> {
        const admin=await AdminModel.findOne({where: {email:email, password:password}, raw:true})
        if(!admin) return null
        return new Admin(
            admin.id.toString(),
            admin.email,
            admin.password
        )
    }

}