import { inject, injectable } from "inversify";
import { IGetUserNames } from "../../domain/use-cases/IUserUseCase";
import { TYPES } from "../../types";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

@injectable()
export class GetUserNames implements IGetUserNames {

    constructor(
        @inject(TYPES.IUserRepository) private _userRepository:IUserRepository
    ){}

    async getUserNames(id: string): Promise<string> {
        const result=await this._userRepository.findById(id);
        return result!.username;
    }

}