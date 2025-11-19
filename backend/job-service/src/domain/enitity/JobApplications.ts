export class Applications {
    constructor (
        public _id:string,
        public user:string,
        public resume:string,
        public coverLetter:string,
        public status:string,
        public createdAt:Date
    ) {}
}

export class JobApplications {
    constructor (
        public _id:string,
        public jobPost:string,
        public applicants:Applications[]
    ) {}
}