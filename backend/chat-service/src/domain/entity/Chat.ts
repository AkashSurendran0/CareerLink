export class Content {
    constructor (
        public _id:string,
        public sendBy:string,
        public message:string,
        public isRead:boolean,
        public sendAt:Date
    ){}
}

export class Chat {
    constructor (
        public _id:string,
        public conversation:string,
        public content:Content[],
        public createdAt:Date
    ){}
}