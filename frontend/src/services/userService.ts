import api from "@/lib/api";

type Data = {
    email:string
}

type LoginDetails = {
    email:string,
    password:string
}

type ChangePassForm = {
    email:string,
    password:string,
    confirmPass:string
}

type SignupForm = {
    username:string,
    email:string,
    password:string,
    confirmPass:string
}

export const loginUser = async (loginDetails: LoginDetails) => {
    const res=await api.post('/user/v1/login', loginDetails)
    return res.data
}

export const resetGetOtp = async (email: string) => {
    const res=await api.get(`/user/v1/getOTP?email=${email}`)
    return res.data
}

export const sendResetOtp = async (data: Data) => {
    const res=await api.post('/user/v1/sendResetOTP', data)
    return res.data
}

export const changePassword = async (changePassForm: ChangePassForm) => {
    const res=await api.post('/user/v1/changePassword', changePassForm)
    return res.data
}

export const getSignupOtp = async (email: string) => {
    const res=await api.get(`/user/v1/getOTP?email=${email}`)
    return res.data
}

export const sendSignupOtp = async (data: Data) => {
    const res=await api.post('/user/v1/sendOTP', data)
    return res.data
}

export const signUp = async (signupForm: SignupForm) => {
    const res=await api.post('/user/v1/signup', signupForm)
    return res.data
}

export const getCompanyInfo = async () => {
    const res=await api.get('/company/v1/getCompanyDetails')
    return res.data
}

export const editCompany = async (formData) => {
    const res=await api.post('/company/v1/editCompany', formData)
    return res.data
}

export const addCompany = async (formData) => {
    const res=await api.post('/company/v1/addCompany', formData)
    return res.data 
}

export const getUserDetails = async () => {
    const res=await api.get('/user/v1/getUserDetails')
    return res.data
}

export const editUserDetails = async (formData) => {
    const res=await api.patch('/user/v1/editUserDetails', formData)
    return res.data
}

export const addUserDetails = async (form) => {
    const res=await api.post('/user/v1/addUserDetails', form)
    return res.data
}

export const getCompanyRegistrationInfo = async () => {
    const res=await api.get('company/v1/getCompanyRegistrationInfo')
    return res.data
}

export const reapplyCompany = async () => {
    const res=await api.patch('company/v1/reapplyCompany')
    return res.data
}

export const deleteCompany = async (id:string) => {
    const res=await api.delete(`company/v1/deleteCompany?id=${id}`)
    return res.data
}

export const getAllNotifications = async () => {
    const res=await api.get('notification/v1/getNotifications')
    console.log('noti', res.data)
    return res.data
}

export const markAllNotificationsRead = async () => {
    const res=await api.patch('notification/v1/markAllRead')
    return res.data
}

export const deleteAllNotifications = async () => {
    const res=await api.delete('notification/v1/deleteAll')
    return res.data
}

export const deleteOneNotification = async (id:string) => {
    const res=await api.delete(`notification/v1/deleteOne?id=${id}`)
    return res.data
}

export const markOneRead = async (id:string) => {
    const res=await api.patch(`notification/v1/readOne?id=${id}`)
    return res.data
}

export const addJob = async (jobDetails) => {
    const res=await api.post('job/v1/addJob', jobDetails)
    return res.data
}

export const getAllCompanyJob = async () => {
    const res=await api.get('job/v1/getAllJobs')
    return res.data
}

export const getJobDetails = async (id:string) => {
    const res=await api.get(`job/v1/getJobDetails?id=${id}`)
    return res.data
}

export const editJob = async (jobDetails) => {
    const res=await api.patch('job/v1/editJob', jobDetails)
    return res.data
}