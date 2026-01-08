export interface PostDto {
    _id:string,
    image:string | null,
    text:string | null,
    createdBy:string,
    comments:{
        comment:string,
        by:string,
        createdAt:Date
    }[],
    likes:number,
    likedBy:string[],
    createdAt:Date
}