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
    checkCompanyRegistrationInfo (user:string):Promise<{success:boolean}>
}

export interface IEditCompany {
    editCompany (userId:string, details:Details): Promise<{success:boolean}>
}

export interface IGetAllCompanies {
    getAllCompanies (page:number, limit:number, query:string | undefined):Promise<{result: {id:string, logo:string, name:string, createdAt:Date, suspended:boolean}[], pageLimit:number}>
}

export interface IGetCompanyDetails {
    getCompanyDetails (user:string):Promise<CompanyDTO>
}

export interface ICheckCompanyDetails {
    getCompanyInfo(id:string):Promise<CompanyDTO>
}

export interface IAlterCompanyRegistrationStatus {
    alterCompanyRegistrationStatus(code:number, id:string):Promise<{success:boolean} | null>
}

export interface IReapplyCompany {
    reapplyCompany (user:string): Promise<CompanyDTO>
}

export interface IDeleteCompany {
    deleteCompany (user:string):Promise<{success:boolean}>
}