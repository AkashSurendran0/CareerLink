import { inject, injectable } from "inversify";
import { IDeletePost } from "../domain/use-cases/IPostUseCase";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";

@injectable()
export class DeletePost implements IDeletePost {

    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ) {}

    async deletePost(id: string): Promise<any> {
        await this._postRepository.deletePost(id)
        return
    }


}