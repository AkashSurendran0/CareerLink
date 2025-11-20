import { inject, injectable } from "inversify";
import { IAlterPostLike } from "../domain/use-cases/IPostUseCase";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";

@injectable()
export class AlterPostLike implements IAlterPostLike {
    
    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ) {}

    async alterPostLike(post: string, user: string): Promise<any> {
        await this._postRepository.alterPostLike(post, user)
        return null
    }

}