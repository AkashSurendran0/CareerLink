export class Conversation {
    constructor(
        public _id: string,
        public isCompany: boolean,
        public users: string[],
        public createdAt: Date,
        public lastMessage?: any,
        public unreadCount?: number
    ) { }
}