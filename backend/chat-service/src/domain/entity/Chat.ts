export class Content {
    constructor (
        public _id:string,
        public isRead:boolean,
        public sendAt:Date,
        public sendBy?:string,
        public time?:string,
        public date?:string,
        public message?:string,
        public attachment?: string,
        public isScheduleMessage?:boolean,
        public callStatus?: string,
        public duration?: string,
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