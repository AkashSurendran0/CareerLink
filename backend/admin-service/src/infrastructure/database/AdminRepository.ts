import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel } from "../models/AdminModel";

type AdminRecord = {
    id: number;
    email: string;
    password: string;
} | null;

export class AdminRepository implements IAdminRepository {

    async findAdmin (email:string, password:string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ where: { email, password }, raw: true }) as AdminRecord;
        if (!admin) return null;
        return new Admin(
            String(admin.id),
            admin.email,
            admin.password
        );
    }

    async checkAdmin(user: string): Promise<{ success: boolean; }> {
        const admin = await AdminModel.findOne({ where: { email: user }, raw: true }) as AdminRecord;
        return { success: Boolean(admin) };
    }

}