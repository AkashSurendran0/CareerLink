import { inject, injectable } from "inversify";
import { IGetAllPosts } from "../domain/use-cases/IPostUseCase";
import { PostDto } from "../dto/PostDto";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";
import { PostMapper } from "../mapper/PostMapper";

@injectable()
export class GetAllPosts implements IGetAllPosts {

    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ) {}

    async getAllPosts(): Promise<PostDto[]> {
        const posts=await this._postRepository.getAllPosts()
        return posts.map(post=>PostMapper.toDTO(post))
    }

}