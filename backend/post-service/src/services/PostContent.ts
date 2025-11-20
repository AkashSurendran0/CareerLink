import { inject, injectable } from "inversify";
import { IPostContent } from "../domain/use-cases/IPostUseCase";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";
import { PostDto } from "../dto/PostDto";
import { PostMapper } from "../mapper/PostMapper";

@injectable()
export class PostContent implements IPostContent {

    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ){}

    async postContent(url: string | null, content: string | null, user:string): Promise<PostDto> {
        const result=await this._postRepository.addPost(url, content, user)
        return PostMapper.toDTO(result)
    }

}   