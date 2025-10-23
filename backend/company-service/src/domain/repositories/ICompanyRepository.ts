import { Company } from "../entities/Company";

type Details = {
    registeredBy:string,
    logo:string | null,
    companyName:string,
    companySize:string,
    foundedYear:number,
    industry:string,
    websiteURL:string | null,
    location:string,
    aboutCompany:string
}

export interface ICompanyRepository {
    addCompany(userId:string, details:Details): Promise<Company>
    checkCompany (userId:string): Promise<{success:boolean}>
    getCompanyDetails (userId:string): Promise<Company>
    editCompany (user:string, details:Details): Promise<Company>
    findById (id:string):Promise<Company | null>
    changeCompanyStatus (company:Company): Promise<Company>
    approveCompany (id:string): Promise<Company>
    rejectCompany (id:string, reason:string[]): Promise<Company>
    changeRejectedStatus(user:string): Promise<Company>
    deleteCompany(id:string): Promise<{success:boolean}>
}