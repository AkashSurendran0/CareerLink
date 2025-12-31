import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";
import { UserMapper } from "../../mappers/UserMapper";
import { UserDTO } from "../../dto/UserDTO";
import { IAlterUserStatus } from "../../domain/use-cases/IUserUseCase";

@injectable()
export class AlterUserStatus implements IAlterUserStatus {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) { }

    async changeUserStatus(id: string): Promise<UserDTO> {
        const user = await this._userRepository.findById(id);
        if (!user) throw new Error("User not found");
        const updatedUser = await this._userRepository.alterUserStatus(user);
        await elasticClient.update({
            index: "users",
            id: updatedUser.id.toString(),
            doc: {
                suspended: updatedUser.suspended
            }
        });
        await elasticClient.indices.refresh({ index: "users" });
        return UserMapper.toDTO(updatedUser);
    }

}