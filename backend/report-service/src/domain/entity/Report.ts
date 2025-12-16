export class Report {
    constructor(
        public id:string,
        public reportedBy:string | null,
        public reportedChat:string | null,
        public reportedAccount:string | null,
        public reason:string,
        public status:string,
        public createdAt:Date,
        public reportedCompany:string
    ){}
}