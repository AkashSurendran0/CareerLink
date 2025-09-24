import { IUserRepository } from "../../domain/repositories/IUserRepository";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";

@injectable()
export class AlterUserStatus {
    
    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) {}

    async changeUserStatus (id:string) {
        const user=await this._userRepository.findById(id);
        const updatedUser=await this._userRepository.alterUserStatus(user);
        return updatedUser;
    }

}