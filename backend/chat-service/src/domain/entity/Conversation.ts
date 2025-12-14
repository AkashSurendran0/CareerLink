export class Conversation {
    constructor (
        public _id:string,
        public isCompany:boolean,
        public user:string,
        public createdAt:Date   
    ){}
}