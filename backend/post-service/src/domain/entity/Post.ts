export class Comments {
    constructor(
        public comment:string,
        public by:string,
        public createdAt:Date
    ) {}
}

export class Post {
    constructor(
        public _id:string,
        public image:string | null,
        public text:string | null,
        public createdBy:string,
        public comments:Comments[],
        public likes:number,
        public likedBy:string[],
        public createdAt:string[]
    ) {}
}