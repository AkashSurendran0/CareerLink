import { Post } from "../entity/Post"

export interface IPostRepository {
    addPost(url:string | null, content:string | null, user:string): Promise<Post>
}