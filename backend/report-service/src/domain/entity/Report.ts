export class Report {
    constructor(
        public id:string,
        public reportedBy:string | null | undefined,
        public reportedChat:string | null | undefined,
        public reportedConvo:string | null | undefined,
        public reportedAccount:string | null | undefined,
        public reason:string,
        public status:string,
        public createdAt:Date,
        public reportedCompany:string | undefined | null
    ){}
}