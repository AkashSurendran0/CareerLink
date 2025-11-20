import { PostDto } from "../dto/PostDto";

export class PostMapper {
    static toDTO (post:any): PostDto {
        return {
            _id:post._id,
            image:post.image,
            text:post.text,
            createdBy:post.createdBy,
            comments:post.comments.map((i: any)=>({
                comment:i.comment,
                by:i.by,
                createdAt:i.createdAt
            })),
            likes:post.likes,
            likedBy:post.likedBy,
            createdAt:post.createdAt
        }
    }
}