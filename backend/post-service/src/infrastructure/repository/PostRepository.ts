import { Post } from "../../domain/entity/Post";
import { IPostRepository } from "../../domain/repository/IPostRepository";
import { PostModel } from "../model/PostModel";

export class PostRepository implements IPostRepository {

    async addPost(url: string | null, content: string | null, user:string): Promise<Post> {
        const post=await PostModel.insertOne(
            {
                image:url,
                text:content,
                createdBy:user,
                comments:[],
                likedBy:[]
            }
        )
        return new Post (
            post._id,
            post.image,
            post.text,
            post.createdBy,
            post.comments,
            post.likes,
            post.likedBy,
            post.createdAt
        )
    }

}