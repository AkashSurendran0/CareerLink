import { IUserRepository } from "../../domain/repositories/IUserRepository";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { ICheckUserBlock } from "../../domain/use-cases/IUserUseCase";

@injectable()
export class CheckUserBlock implements ICheckUserBlock {
    
    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) {}

    async checkUserBlock (id:string): Promise<{success:boolean} | null> {
        console.log("heeeeeeeee");
        const user=await this._userRepository.findById(id);
        if(!user) return null;
        return {
            success:user.suspended
        };
    }

}