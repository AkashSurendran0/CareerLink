import { PostDto } from "../../dto/PostDto";

export interface IPostContent {
    postContent(url:string | null, content:string | null, user:string): Promise<PostDto>
}

export interface IGetAllPosts {
    getAllPosts(): Promise<PostDto[]>
}