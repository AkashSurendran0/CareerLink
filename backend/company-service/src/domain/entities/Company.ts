export class Company {
    constructor(
        public id: string,
        public registeredBy: string,
        public logo: string,
        public name: string,
        public companySize: string,
        public foundedYear: number,
        public industry: string,
        public location: string,
        public aboutCompany: string,
        public approved: boolean,
        public rejected: boolean,
        public suspended: boolean,
        public createdAt?: Date,

        public websiteURL?: string | null,
        public rejectReasons?: string[] | null,
    ) { }
}