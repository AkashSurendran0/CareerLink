import { inject, injectable } from "inversify";
import { IGetUserNames } from "../../domain/use-cases/IUserUseCase";
import { TYPES } from "../../types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserDetailsRepository } from "../../domain/repositories/IUserDetailsRepository";

@injectable()
export class GetUserNames implements IGetUserNames {

    constructor(
        @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.IUserDetailsRepository) private _userDetailsRepository: IUserDetailsRepository
    ) { }

    async getUserNames(id: string): Promise<any> {
        const result = await this._userRepository.findById(id);
        if (!result) return { result: null };
        const details = await this._userDetailsRepository.getUserDetails(result.id)
        return { result, pfp: details?.profilePicture };
    }

    async getUserNamesByEmail(email: string): Promise<any> {
        const result = await this._userRepository.findByEmail(email);
        if (!result) return { result: null };
        const details = await this._userDetailsRepository.getUserDetails(result.id)
        return { result, pfp: details?.profilePicture };
    }

    async getUserInfo(email: string): Promise<any> {
        const result = await this._userRepository.findByEmail(email)
        return result
    }

}