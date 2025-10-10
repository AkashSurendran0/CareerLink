import { CompanyDTO } from "../../dto/CompanyDTO"

type Details = {
    registeredBy:string,
    logo:string,
    companyName:string,
    companySize:string,
    foundedYear:number,
    industry:string,
    websiteURL:string | null,
    location:string,
    aboutCompany:string
}


export interface IAddCompany {
    addCompany (userId:string, details:Details): Promise<{success:boolean}>
}

export interface IAlterCompanyStatus {
    changeCompanyStatus (id:string):Promise<CompanyDTO>
}

export interface ICheckCompanyRegistrationInfo {
    checkCompanyRegistrationInfo (userId:string):Promise<{success:boolean}>
}

export interface IEditCompany {
    editCompany (userId:string, details:Details): Promise<{success:boolean}>
}

export interface IGetAllCompanies {
    getAllCompanies (page:number, limit:number, query:string | undefined):Promise<{result: {id:string, logo:string, name:string, createdAt:Date, suspended:boolean}[], pageLimit:number}>
}

export interface IGetCompanyDetails {
    getCompanyDetails (userId:string):Promise<CompanyDTO>
}