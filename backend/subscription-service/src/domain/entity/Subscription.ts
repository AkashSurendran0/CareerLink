export class Subscription {
    constructor (
        public id:number,
        public user:string,
        public subscriptionType:string,
        public validTill:Date,
        public createdAt:Date
    ) {}
}