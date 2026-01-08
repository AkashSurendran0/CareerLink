export class Conversation {
    constructor(
        public _id: string,
        public isCompany: boolean,
        public users: string[],
        public createdAt: Date,
        public lastMessage?: unknown,
        public unreadCount?: number | null
    ) { }
}