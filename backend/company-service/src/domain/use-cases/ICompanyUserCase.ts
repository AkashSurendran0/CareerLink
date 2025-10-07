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