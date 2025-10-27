export class Job {
    constructor(
        public _id:string,
        public company:string,
        public open:boolean,
        public jobTitle:string,
        public department:string,
        public jobType:string,
        public location:string,
        public jobDescription:string,
        public qualifications:string[],
        public responsibilities:string[],
        public benefits:string[],
        public experienceLevel:string,
        public deadline:Date,
        public createdAt:Date
    ){}
}