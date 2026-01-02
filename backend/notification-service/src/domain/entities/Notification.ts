export class Notification {
    constructor(
        public _id:string,
        public user:string,
        public content:string,
        public routeTo: string,
        public isRead:boolean,
        public createdAt?:Date
    ){}
}