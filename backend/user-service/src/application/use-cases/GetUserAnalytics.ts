import { inject, injectable } from "inversify";
import { IGetUserAnalytics } from "../../domain/use-cases/IUserUseCase";
import { TYPES } from "../../types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

@injectable()
export class GetUserAnalytics implements IGetUserAnalytics {

    constructor(
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository
    ){}

    async getUserAnalytics(): Promise<any> {
        const result=await this._userRepository.getUserAnalytics();
        return result;
    }

}