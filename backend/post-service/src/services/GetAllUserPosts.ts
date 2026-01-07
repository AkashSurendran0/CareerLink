import { inject, injectable } from "inversify";
import { IGetAllUserPosts } from "../domain/use-cases/IPostUseCase";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";
import { PostDto } from "../dto/PostDto";
import { PostMapper } from "../mapper/PostMapper";

@injectable()
export class GetAllUserPosts implements IGetAllUserPosts {

    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ) {}

    async getAllPosts(user: string): Promise<PostDto[]> {
        const result=await this._postRepository.getAllUserPosts(user);
        return result.map(i=>PostMapper.toDTO(i));
    }

}