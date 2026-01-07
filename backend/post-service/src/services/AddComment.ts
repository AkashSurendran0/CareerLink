import { inject, injectable } from "inversify";
import { IAddComment } from "../domain/use-cases/IPostUseCase";
import { PostDto } from "../dto/PostDto";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";
import { PostMapper } from "../mapper/PostMapper";

@injectable()
export class AddComment implements IAddComment {

    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ) {}

    async addComment(data: { comment: string; post: string; }, user: string): Promise<PostDto> {
        const result=await this._postRepository.addComment(data, user);
        return PostMapper.toDTO(result);
    }

}