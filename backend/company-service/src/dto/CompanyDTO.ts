export interface CompanyDTO {
    id:string,
    logo:string,
    name:string,
    registeredBy:string,
    companySize:string,
    foundedYear:number,
    industry:string,
    websiteURL:string,
    location:string,
    aboutCompany:string,
    approved:boolean,
    suspended:boolean,
    rejected:boolean,
    createdAt:Date,
    rejectReasons:string[]
}
    