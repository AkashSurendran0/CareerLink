import api from "@/lib/api";

type LoginDetails = {
    email:string,
    password:string
}

type ID = {
    id:string
}

export const adminLogin = async (loginDetails: LoginDetails) =>{
    const res=await api.post('/admin/v1/login', loginDetails)
    return res.data
}

export const getCompanies = async (start:number, limit:number, query:string) => {
    const res=await api.get(`/company/v1/getCompanies?page=${start}&limit=${limit}&query=${query}`)
    return res.data
}

export const changeCompanyStatus = async (company: ID) => {
    const res=await api.patch('/company/v1/alterCompanyStatus', company)
    return res.data
}

export const rejectCompany = async (id:string, reasons:string[]) => {
    const res=await api.patch(`/company/v1/rejectCompany?&id=${id}`, reasons)
    return res.data
}

export const acceptCompany = async (id:string) => {
    const res=await api.patch(`/company/v1/acceptCompany?&id=${id}`)
    return res.data
}

export const checkCompanyDetails = async (id:string) => {
    const res=await api.get(`/company/v1/checkCompanyDetails?id=${id}`)
    return res.data
}

export const getUsers = async (start:number, limit:number, query:string) => {
    const res=await api.get(`/user/v1/getUsers?page=${start}&limit=${limit}&query=${query}`)
    return res.data
}

export const changeUserStatus = async (user: ID) => {
    const res=await api.patch('/user/v1/alterUserStatus', user)
    return res.data
}