export class Company {
    constructor(
        public id:string,
        public registeredBy:string,
        public logo:string,
        public name:string,
        public companySize:number,
        public foundedYear:number,
        public industry:string,
        public websiteURL:string,
        public location:string,
        public aboutCompany:string,
        public approved:boolean,
        public rejected:boolean,
        public suspended:boolean,
        public createdAt:Date,
        
        public rejectReasons?:string[],
    ){}
}