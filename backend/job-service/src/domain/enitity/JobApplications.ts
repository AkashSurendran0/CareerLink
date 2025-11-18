export class Applications {
    constructor (
        public user:string,
        public resume:string,
        public coverLetter:string,
        public status:string,
        public createdAt:Date
    ) {}
}

export class JobApplications {
    constructor (
        public jobPost:string,
        public applicants:Applications[]
    ) {}
}