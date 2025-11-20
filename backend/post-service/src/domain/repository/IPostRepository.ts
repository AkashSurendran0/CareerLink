import { Post } from "../entity/Post"

export interface IPostRepository {
    addPost(url:string | null, content:string | null, user:string): Promise<Post>
    getAllPosts(limit:number, shown:number): Promise<{count:number, post:Post[]}>
    alterPostLike(post:string, user:string): Promise<null>
    addComment(data: { comment: string; post: string; }, user: string): Promise<Post>
    getById(id:string): Promise<Post>
}