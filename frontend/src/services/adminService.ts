import api from "@/lib/api";

type LoginDetails = {
    email:string,
    password:string
}

type ID = {
    id:string
}

type Feature = {
  text: string;
  code: string;
};

type SubscriptionData = {
    planName:string,
    amount:number,
    billingCycle:number,
    features:Feature[]
    status:boolean
}

const USER_V1_ROUTE = '/user/v1'
const ADMIN_V1_ROUTE = '/admin/v1'
const COMPANY_V1_ROUTE = '/company/v1'
const SUBSCRIPTION_V1_ROUTE = '/subscription/v1'

export const adminLogin = async (loginDetails: LoginDetails) =>{
    const res=await api.post(`${ADMIN_V1_ROUTE}/login`, loginDetails)
    return res.data
}

export const getApprovedCompanies = async (start:number, limit:number, query:string) => {
    const res=await api.get(`${COMPANY_V1_ROUTE}/getApprovedCompanies?page=${start}&limit=${limit}&query=${query}`)
    return res.data
}

export const getPendingCompanies = async (start:number, limit:number, query:string) => {
    const res=await api.get(`${COMPANY_V1_ROUTE}/getPendingCompanies?page=${start}&limit=${limit}&query=${query}`)
    return res.data
}

export const changeCompanyStatus = async (company: ID) => {
    const res=await api.patch(`${COMPANY_V1_ROUTE}/alterCompanyStatus`, company)
    return res.data
}

export const rejectCompany = async (id:string, reasons:string[]) => {
    const res=await api.patch(`${COMPANY_V1_ROUTE}/rejectCompany?&id=${id}`, reasons)
    return res.data
}

export const acceptCompany = async (id:string) => {
    const res=await api.patch(`${COMPANY_V1_ROUTE}/acceptCompany?&id=${id}`)
    return res.data
}

export const checkCompanyDetails = async (id:string) => {
    const res=await api.get(`${COMPANY_V1_ROUTE}/checkCompanyDetails?id=${id}`)
    return res.data
}

export const getUsers = async (start:number, limit:number, query:string) => {
    const res=await api.get(`${USER_V1_ROUTE}/getUsers?page=${start}&limit=${limit}&query=${query}`)
    return res.data
}

export const changeUserStatus = async (user: ID) => {
    const res=await api.patch(`${USER_V1_ROUTE}/alterUserStatus`, user)
    return res.data
}

export const addSubscriptionPlan = async (data:SubscriptionData) => {
    const res=await api.post(`${SUBSCRIPTION_V1_ROUTE}/addSubscription`, data)
    return res.data
}

export const getAllPlans = async () => {
    const res=await api.get(`${SUBSCRIPTION_V1_ROUTE}/getAllPlans`)
    return res.data
}

export const alterPlanStatus = async (id:string) => {
    const res=await api.patch(`${SUBSCRIPTION_V1_ROUTE}/alterPlanStatus?plan=${id}`)
    return res.data
}

export const adminUpgradeUser = async (data:any) => {
    const res=await api.post(`${SUBSCRIPTION_V1_ROUTE}/adminUpgradeUser`, data)
    return res.data
}

export const adminDowngradeUser = async (id:string) => {
    const res=await api.delete(`${SUBSCRIPTION_V1_ROUTE}/adminDowngradeUser?id=${id}`)
    return res.data
}