import mongoose from "mongoose";
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

    async getAllPosts(limit:number, shown:number): Promise<{count:number, post:Post[]}> {
        const allPostCount=await PostModel.find().countDocuments()
        const allPosts=await PostModel.find().skip(shown).limit(limit).sort({createdAt:-1})
        const post= allPosts.map(post=>
            new Post (
                post._id,
                post.image,
                post.text,
                post.createdBy,
                post.comments,
                post.likes,
                post.likedBy,
                post.createdAt
            )
        )
        return {count:allPostCount, post}
    }

    async alterPostLike(post: string, user: string): Promise<null> {
        const findPost=await PostModel.findOne({_id:post})
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
            )
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
            )
        }
        return null
    }

    async addComment(data: { comment: string; post: string; }, user: string): Promise<Post> {
        const post=await PostModel.findByIdAndUpdate(
            data.post,
            {$push:{
                comments:{
                    comment:data.comment,
                    by:user
                }
            }},
            {new:true}
        )
        return new Post (
            post!._id,
            post!.image,
            post!.text,
            post!.createdBy,
            post!.comments,
            post!.likes,
            post!.likedBy,
            post!.createdAt
        )
    }

    async getById(id: string): Promise<Post> {
        const post=await PostModel.findOne({_id:id})
        return new Post (
            post!._id,
            post!.image,
            post!.text,
            post!.createdBy,
            post!.comments,
            post!.likes,
            post!.likedBy,
            post!.createdAt
        )
    }

    async getAllUserPosts(user: string): Promise<Post[]> {
        const posts=await PostModel.find({createdBy:user})
        return posts.map(post=>
            new Post (
                post!._id,
                post!.image,
                post!.text,
                post!.createdBy,
                post!.comments,
                post!.likes,
                post!.likedBy,
                post!.createdAt
            )
        )
    }

    async deletePost(id: string): Promise<any> {
        await PostModel.findByIdAndDelete(id)
        return
    }

}