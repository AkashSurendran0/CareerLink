export class Job {
    constructor(
        public id:string,
        public company:string,
        public jobTitle:string,
        public department:string,
        public jobType:string,
        public location:string,
        public jobDescription:string,
        public qualifications:string[],
        public responsibilities:string[],
        public benefits:string[],
        public experienceLevel:string,
        public education:string,
        public deadLine:Date,
        public createdAt:Date
    ){}
}