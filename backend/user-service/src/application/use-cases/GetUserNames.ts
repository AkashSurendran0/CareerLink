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

    async getUserNames(id: string): Promise<{ result: import("../../domain/entities/User").User | null; pfp?: string | null }> {
        const result = await this._userRepository.findById(id);
        if (!result) return { result: null };
        const details = await this._userDetailsRepository.getUserDetails(result.id);
        return { result, pfp: details?.profilePicture ?? null };
    }

    async getUserNamesByEmail(email: string): Promise<{ result: import("../../domain/entities/User").User | null; pfp?: string | null }> {
        const result = await this._userRepository.findByEmail(email);
        if (!result) return { result: null };
        const details = await this._userDetailsRepository.getUserDetails(result.id);
        return { result, pfp: details?.profilePicture ?? null };
    }

    async getUserInfo(email: string): Promise<import("../../domain/entities/User").User | null> {
        const result = await this._userRepository.findByEmail(email);
        return result;
    }

}