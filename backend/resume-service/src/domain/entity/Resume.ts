export class ResumeItem {
    constructor(
        public name: string,
        public url: string,
        public createdAt: Date
    ) {}
}

export class Resume {
    constructor(
        public _id:string,
        public user: string,
        public resumes: ResumeItem[]
    ) {}
}
