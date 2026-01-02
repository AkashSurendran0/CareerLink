import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel } from "../models/AdminModel";

export class AdminRepository implements IAdminRepository {

    async findAdmin (email:string, password:string): Promise<Admin | null> {
        // raw:true returns plain object (DB boundary) - allow any
        const admin: any = await AdminModel.findOne({ where: { email, password }, raw: true })
        if (!admin) return null
        return new Admin(
            String(admin.id),
            admin.email,
            admin.password
        )
    }

    async checkAdmin(user: string): Promise<{ success: boolean; }> {
        // use raw query to avoid model instances
        const admin: any = await AdminModel.findOne({ where: { email: user }, raw: true })
        return { success: Boolean(admin) }
    }

}