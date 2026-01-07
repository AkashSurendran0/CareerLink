import { PostDto } from "../dto/PostDto";
import { IPost } from "../infrastructure/model/PostModel";
import mongoose from "mongoose";

type PostSource = Partial<IPost> & { _id?: string | mongoose.Types.ObjectId };

export class PostMapper {
    static toDTO (post: PostSource): PostDto {
        return {
            _id: String(post._id),
            image: post.image ?? null,
            text: post.text ?? null,
            createdBy: String(post.createdBy ?? ""),
            comments: (post.comments ?? []).map((i: { comment?: string; by?: string; createdAt?: Date }) => ({
                comment: String(i.comment ?? ""),
                by: String(i.by ?? ""),
                createdAt: i.createdAt ?? new Date()
            })),
            likes: Number(post.likes ?? 0),
            likedBy: post.likedBy ?? [],
            createdAt: post.createdAt ?? new Date()
        };
    }
}