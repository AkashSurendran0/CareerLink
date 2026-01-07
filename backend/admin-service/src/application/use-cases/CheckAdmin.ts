import { inject, injectable } from "inversify";
import { ICheckAdmin } from "../../domain/use-cases/IAdminLogin";
import { TYPES } from "../../types";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository";

@injectable()
export class CheckAdmin implements ICheckAdmin {

    constructor(
        @inject(TYPES.IAdminRepository) private _adminRepository:IAdminRepository
    ) {}

    async checkAdmin(user: string): Promise<{ success: boolean; }> {
        const result=await this._adminRepository.checkAdmin(user);
        return result;
    }

}