import { inject, injectable } from "inversify";
import { IGetSinglePostDetails } from "../domain/use-cases/IPostUseCase";
import { TYPES } from "../types";
import { IPostRepository } from "../domain/repository/IPostRepository";
import { PostDto } from "../dto/PostDto";
import { PostMapper } from "../mapper/PostMapper";

@injectable()
export class GetSinglePostDetails implements IGetSinglePostDetails {

    constructor(
        @inject(TYPES.IPostRepository) private _postRepository:IPostRepository
    ) {}

    async getDetails(id: string): Promise<PostDto> {
        const result=await this._postRepository.getById(id)
        return PostMapper.toDTO(result)
    }

}