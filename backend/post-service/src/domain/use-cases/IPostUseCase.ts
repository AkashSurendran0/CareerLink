import { PostDto } from "../../dto/PostDto";

export interface IPostContent {
    postContent(url:string | null, content:string | null, user:string): Promise<PostDto>
}

export interface IGetAllPosts {
    getAllPosts(limit:number, shown:number): Promise<{count:number, allPost:PostDto[]}>
}

export interface IAlterPostLike {
    alterPostLike(post:string, user:string): Promise<void>
}