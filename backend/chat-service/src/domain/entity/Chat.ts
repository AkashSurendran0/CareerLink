export class Content {
    constructor (
        public _id:string,
        public sendBy:string,
        public isRead:boolean,
        public sendAt:Date,
        public time?:string,
        public date?:string,
        public message?:string,
        public isScheduleMessage?:boolean,
    ){}
}

export class Chat {
    constructor (
        public _id:string,
        public conversation:string,
        public content:Content[],
        public createdAt:Date,
    ){}
}