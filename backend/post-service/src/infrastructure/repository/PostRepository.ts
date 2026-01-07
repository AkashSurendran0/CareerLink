import mongoose from "mongoose";
import { Post, Comments } from "../../domain/entity/Post";
import { IPostRepository } from "../../domain/repository/IPostRepository";
import { PostModel, IPost } from "../model/PostModel";

type PostCommentSource = { comment?: string; by?: string; createdAt?: Date };

export class PostRepository implements IPostRepository {

    async addPost(url: string | null, content: string | null, user:string): Promise<Post> {
        const post = await PostModel.insertOne(
            {
                image:url,
                text:content,
                createdBy:user,
                comments:[],
                likedBy:[]
            }
        );
        // Database boundary: map comments from MongoDB format to Comments entities
        const p = post as unknown as IPost;
        const mappedComments = (p.comments ?? []).map((c: PostCommentSource) => 
            new Comments(c.comment ?? "", c.by ?? "", c.createdAt ?? new Date())
        );
        return new Post (
            post._id.toString(),
            post.image,
            post.text,
            post.createdBy,
            mappedComments,
            post.likes,
            post.likedBy,
            post.createdAt
        );
    }

    async getAllPosts(limit:number, shown:number): Promise<{count:number, post:Post[]}> {
        const allPostCount=await PostModel.find().countDocuments();
        const allPosts=await PostModel.find().skip(shown).limit(limit).sort({createdAt:-1});
        const post= allPosts.map(postItem=> {
            const p = postItem as IPost;
            // Database boundary: map comments from MongoDB format to Comments entities
            const mappedComments = (p.comments ?? []).map((c: PostCommentSource) => 
                new Comments(c.comment ?? "", c.by ?? "", c.createdAt ?? new Date())
            );
            return new Post (
                p._id.toString(),
                p.image,
                p.text,
                p.createdBy,
                mappedComments,
                p.likes,
                p.likedBy,
                p.createdAt
            );
        });
        return {count:allPostCount, post};
    }

    async alterPostLike(post: string, user: string): Promise<null> {
        const findPost=await PostModel.findOne({_id:post});
        if(findPost?.likedBy.includes(user)){
            await PostModel.updateOne(
                {_id:post},
                {
                    $pull:{
                        likedBy:user
                    },
                    $inc:{
                        likes:-1
                    }
                }
            );
        }else{
            await PostModel.updateOne(
                {_id:post},
                {
                    $push:{
                        likedBy:user
                    },
                    $inc:{
                        likes:1
                    }
                }
            );
        }
        return null;
    }

    async addComment(data: { comment: string; post: string; }, user: string): Promise<Post> {
        const post = await PostModel.findByIdAndUpdate(
            data.post,
            {$push:{
                comments:{
                    comment:data.comment,
                    by:user
                }
            }},
            {new:true}
        );
        // Database boundary: map comments from MongoDB format to Comments entities
        const p = post as unknown as IPost;
        const mappedComments = (p.comments ?? []).map((c: PostCommentSource) => 
            new Comments(c.comment ?? "", c.by ?? "", c.createdAt ?? new Date())
        );
        return new Post (
            p._id.toString(),
            p.image,
            p.text,
            p.createdBy,
            mappedComments,
            p.likes,
            p.likedBy,
            p.createdAt
        );
    }

    async getById(id: string): Promise<Post> {
        const post = await PostModel.findOne({_id:id}) as IPost | null;
        // Database boundary: map comments from MongoDB format to Comments entities
        const mappedComments = (post?.comments ?? []).map((c: PostCommentSource) => 
            new Comments(c.comment ?? "", c.by ?? "", c.createdAt ?? new Date())
        );
        return new Post (
            post!._id.toString(),
            post!.image,
            post!.text,
            post!.createdBy,
            mappedComments,
            post!.likes,
            post!.likedBy,
            post!.createdAt
        );
    }

    async getAllUserPosts(user: string): Promise<Post[]> {
        const posts = await PostModel.find({createdBy:user}) as IPost[];
        return posts.map(post => {
            // Database boundary: map comments from MongoDB format to Comments entities
            const mappedComments = (post.comments ?? []).map((c: PostCommentSource) => 
                new Comments(c.comment ?? "", c.by ?? "", c.createdAt ?? new Date())
            );
            return new Post (
                post._id.toString(),
                post.image,
                post.text,
                post.createdBy,
                mappedComments,
                post.likes,
                post.likedBy,
                post.createdAt
            );
        });
    }

    async deletePost(id: string): Promise<void> {
        await PostModel.findByIdAndDelete(id);
        return;
    }

}