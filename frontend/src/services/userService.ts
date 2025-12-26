import api from "@/lib/api";

type Data = {
    email: string
}

type LoginDetails = {
    email: string,
    password: string
}

type ChangePassForm = {
    email: string,
    password: string,
    confirmPass: string
}

type SignupForm = {
    username: string,
    email: string,
    password: string,
    confirmPass: string
}

type Amount = {
    amount: number
}

const USER_V1_ROUTE = '/user/v1'
const COMPANY_V1_ROUTE = '/company/v1'
const NOTIFICATION_V1_ROUTE = '/notification/v1'
const JOB_V1_ROUTE = '/job/v1'
const RESUME_V1_ROUTE = '/resume/v1'
const POST_V1_ROUTE = '/media/v1'
const SUBSCRIPTION_V1_ROUTE = '/subscription/v1'
const CHAT_V1_ROUTE = '/chat/v1'
const REPORT_V1_ROUTE = '/report/v1'

export const loginUser = async (loginDetails: LoginDetails) => {
    const res = await api.post(`${USER_V1_ROUTE}/login`, loginDetails)
    return res.data
}

export const resetGetOtp = async (email: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getOTP?email=${email}`)
    return res.data
}

export const sendResetOtp = async (data: Data) => {
    const res = await api.post(`${USER_V1_ROUTE}/sendResetOTP`, data)
    return res.data
}

export const changePassword = async (changePassForm: ChangePassForm) => {
    const res = await api.post(`${USER_V1_ROUTE}/changePassword`, changePassForm)
    return res.data
}

export const getSignupOtp = async (email: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getOTP?email=${email}`)
    return res.data
}

export const sendSignupOtp = async (data: Data) => {
    const res = await api.post(`${USER_V1_ROUTE}/sendOTP`, data)
    return res.data
}

export const signUp = async (signupForm: SignupForm) => {
    const res = await api.post(`${USER_V1_ROUTE}/signup`, signupForm)
    return res.data
}

export const getCompanyInfo = async () => {
    const res = await api.get(`${COMPANY_V1_ROUTE}/getCompanyDetails`)
    return res.data
}

export const editCompany = async (formData: any) => {
    const res = await api.post(`${COMPANY_V1_ROUTE}/editCompany`, formData)
    return res.data
}

export const addCompany = async (formData: any) => {
    const res = await api.post(`${COMPANY_V1_ROUTE}/addCompany`, formData)
    return res.data
}

export const getUserDetails = async () => {
    const res = await api.get(`${USER_V1_ROUTE}/getUserDetails`)
    return res.data
}

export const editUserDetails = async (formData: any) => {
    const res = await api.patch(`${USER_V1_ROUTE}/editUserDetails`, formData)
    return res.data
}

export const addUserDetails = async (form: any) => {
    const res = await api.post(`${USER_V1_ROUTE}/addUserDetails`, form)
    return res.data
}

export const getCompanyRegistrationInfo = async () => {
    const res = await api.get(`${COMPANY_V1_ROUTE}/getCompanyRegistrationInfo`)
    return res.data
}

export const reapplyCompany = async () => {
    const res = await api.patch(`${COMPANY_V1_ROUTE}/reapplyCompany`)
    return res.data
}

export const deleteCompany = async (id: string) => {
    const res = await api.delete(`${COMPANY_V1_ROUTE}/deleteCompany?id=${id}`)
    return res.data
}

export const getAllNotifications = async () => {
    const res = await api.get(`${NOTIFICATION_V1_ROUTE}/getNotifications`)
    return res.data
}

export const markAllNotificationsRead = async () => {
    const res = await api.patch(`${NOTIFICATION_V1_ROUTE}/markAllRead`)
    return res.data
}

export const deleteAllNotifications = async () => {
    const res = await api.delete(`${NOTIFICATION_V1_ROUTE}/deleteAll`)
    return res.data
}

export const deleteOneNotification = async (id: string) => {
    const res = await api.delete(`${NOTIFICATION_V1_ROUTE}/deleteOne?id=${id}`)
    return res.data
}

export const markOneRead = async (id: string) => {
    const res = await api.patch(`${NOTIFICATION_V1_ROUTE}/readOne?id=${id}`)
    return res.data
}

export const addJob = async (jobDetails: any) => {
    const res = await api.post(`${JOB_V1_ROUTE}/addJob`, jobDetails)
    return res.data
}

export const getAllCompanyJob = async (startingPage: number, limit: number, query: string, filter: string, id: string | null) => {
    const res = await api.get(`${JOB_V1_ROUTE}/getAllJobs?start=${startingPage}&limit=${limit}&query=${query}&filter=${filter}&id=${id}`)
    return res.data
}

export const getJobDetails = async (id: string) => {
    const res = await api.get(`${JOB_V1_ROUTE}/getJobDetails?id=${id}`)
    return res.data
}

export const editJob = async (jobDetails: any) => {
    const res = await api.patch(`${JOB_V1_ROUTE}/editJob`, jobDetails)
    return res.data
}

export const closeJob = async (id: string) => {
    const res = await api.patch(`${JOB_V1_ROUTE}/closeJob?id=${id}`)
    return res.data
}

export const getAllJobs = async (query: string) => {
    const res = await api.get(`${JOB_V1_ROUTE}/getAvailableJobs?query=${query}`)
    return res.data
}

export const createResume = async (data: any) => {
    const res = await api.post(`${RESUME_V1_ROUTE}/createResume`, data)
    return res.data
}

export const saveResume = async (data: any) => {
    const res = await api.post(`${RESUME_V1_ROUTE}/saveResume`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res.data
}

export const getAllUserResumes = async () => {
    const res = await api.get(`${RESUME_V1_ROUTE}/getAllUserResumes`)
    return res.data
}

export const createCoverLetter = async (data: any) => {
    const res = await api.post(`${RESUME_V1_ROUTE}/createCoverLetter`, data)
    return res.data
}

export const applyJobWithUrl = async (data: any) => {
    const res = await api.post(`${JOB_V1_ROUTE}/applyJobWithUrl`, data)
    return res.data
}

export const applyJobWithFile = async (formData: any) => {
    const res = await api.post(`${JOB_V1_ROUTE}/applyJobWithFile`, formData, {
        headers: {
            "Content-Type": `multipart/form-data`
        }
    })
    return res.data
}

export const getUserAppliedJobs = async () => {
    const res = await api.get(`${JOB_V1_ROUTE}/getUserAppliedJobs`)
    return res.data
}

export const getJobApplicants = async (id: string, filter: string) => {
    const res = await api.get(`${JOB_V1_ROUTE}/getJobApplicants?job=${id}&filter=${filter}`)
    return res.data
}

export const postContent = async (formData: any) => {
    const res = await api.post(`${POST_V1_ROUTE}/postContent`, formData, {
        headers: {
            "Content-Type": `multipart/form-data`
        }
    })
    return res.data
}

export const getAllPosts = async (limit: number, shown: number) => {
    const res = await api.get(`${POST_V1_ROUTE}/getAllPosts?lim=${limit}&shown=${shown}`)
    return res.data
}

export const alterPostLike = async (postId: string) => {
    const res = await api.patch(`${POST_V1_ROUTE}/alterPostLike?post=${postId}`)
    return res.data
}

export const addComment = async (data: any) => {
    const res = await api.patch(`${POST_V1_ROUTE}/addComment`, data)
    return res.data
}

export const loadSinglePostDetails = async (id: string) => {
    const res = await api.get(`${POST_V1_ROUTE}/getSinglePostDetails?post=${id}`)
    return res.data
}

export const getAllUserPosts = async () => {
    const res = await api.get(`${POST_V1_ROUTE}/getAllUserPosts`)
    return res.data
}

export const deleteUserPost = async (id: string) => {
    const res = await api.delete(`${POST_V1_ROUTE}/deletePost?id=${id}`)
    return res.data
}

export const getTailoredResume = async (id: string) => {
    const res = await api.post(`${RESUME_V1_ROUTE}/getTailoredResume?job=${id}`)
    return res.data
}

export const getTailoredCoverLetter = async (id: string) => {
    const res = await api.post(`${RESUME_V1_ROUTE}/getTailoredCoverLetter?job=${id}`)
    return res.data
}

export const getGithubData = async (username: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getGithubData?user=${username}`)
    return res.data
}

export const getGithubActivity = async (username: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getGithubActivity?user=${username}`)
    return res.data
}

export const getUserRepos = async (page: number, username: string, limit: number) => {
    const res = await api.get(`${USER_V1_ROUTE}/getGithubRepo?page=${page}&user=${username}&limit=${limit}`)
    return res.data
}

export const getActivePlans = async () => {
    const res = await api.get(`${SUBSCRIPTION_V1_ROUTE}/getActivePlans`)
    return res.data
}

export const getOrderId = async (data: Amount) => {
    const res = await api.post(`${SUBSCRIPTION_V1_ROUTE}/create-order`, data)
    return res.data
}

export const verifyPayment = async (response: any) => {
    const res = await api.post(`${SUBSCRIPTION_V1_ROUTE}/verifyPayment`, response)
    return res.data
}

export const stripePayment = async (data: Amount) => {
    const res = await api.post(`${SUBSCRIPTION_V1_ROUTE}/createStripePayment`, data)
    return res.data
}

export const buyPremium = async (id: string, time: number) => {
    const res = await api.post(`${SUBSCRIPTION_V1_ROUTE}/buyPremium?id=${id}&time=${time}`)
    return res.data
}

export const getUserPlan = async () => {
    const res = await api.get(`${SUBSCRIPTION_V1_ROUTE}/getUserPlan`)
    return res.data
}

export const cancelSubscription = async () => {
    const res = await api.delete(`${SUBSCRIPTION_V1_ROUTE}/deletePlan`)
    return res.data
}

export const getSubscriptionInfo = async () => {
    const res = await api.get(`${SUBSCRIPTION_V1_ROUTE}/getSubscriptionInfo`)
    return res.data
}

export const getConnectionUsers = async (query: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getUnconnectedUsers?name=${query}`)
    return res.data
}

export const alterConnReq = async (id: string, action: string) => {
    const res = await api.patch(`${USER_V1_ROUTE}/alterConnectionRequest?user=${id}&action=${action}`)
    return res.data
}

export const viewOtherUserDetails = async (id: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getUserDetails?user=${id}`)
    return res.data
}

export const viewOtherUserPosts = async (id: string) => {
    const res = await api.get(`${POST_V1_ROUTE}/getAllUserPosts?user=${id}`)
    return res.data
}

export const getUserRequests = async (query: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getUserRequests?name=${query}`)
    return res.data
}

export const evaluateRequest = async (id: string, action: string) => {
    const res = await api.patch(`${USER_V1_ROUTE}/evaluateRequest?user=${id}&action=${action}`)
    return res.data
}

export const getConnectedUsers = async (query: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getConnectedUsers?name=${query}`)
    return res.data
}

export const removeConnection = async (id: string) => {
    const res = await api.patch(`${USER_V1_ROUTE}/removeConnection?user=${id}`)
    return res.data
}

export const getConnectionDetails = async (id: string) => {
    const res = await api.get(`${USER_V1_ROUTE}/getConnectionDetails?user=${id}`)
    return res.data
}

export const getAvailableCompanies = async (query: string) => {
    const res = await api.get(`${COMPANY_V1_ROUTE}/getAvailableCompanies?name=${query}`)
    return res.data
}

export const discoverCompanyInfo = async (id: string) => {
    const res = await api.get(`${COMPANY_V1_ROUTE}/getCompanyDetailsByQuery?id=${id}`)
    return res.data
}

export const startUserConversation = async (id: string) => {
    const res = await api.post(`${CHAT_V1_ROUTE}/startUserConversation?user=${id}`)
    return res.data
}

export const getConversations = async () => {
    const res = await api.get(`${CHAT_V1_ROUTE}/getConversations`)
    return res.data
}

export const sendMessage = async (data: any, companyId?: string | null) => {
    const res = await api.patch(`${CHAT_V1_ROUTE}/sendMessage?company=${companyId}`, data)
    return res.data
}

export const getUserChats = async (conversation: string) => {
    const res = await api.get(`${CHAT_V1_ROUTE}/getChats?convo=${conversation}`)
    return res.data
}

export const readOtherUserChats = async (conversation: string) => {
    const res = await api.patch(`${CHAT_V1_ROUTE}/readOtherUserChats?convo=${conversation}`)
    return res.data
}

export const getCompanyConversations = async (companyId: string) => {
    const res = await api.get(`${CHAT_V1_ROUTE}/getCompanyConversations?company=${companyId}`)
    return res.data
}

export const alterUserApplication = async (jobId: string, user: string, companyId: string, action: string) => {
    const res = await api.patch(`${JOB_V1_ROUTE}/alterUserApplication?jobId=${jobId}&user=${user}&company=${companyId}&action=${action}`)
    return res.data
}

export const getActivePlanUsers = async (id: string) => {
    const res = await api.get(`${SUBSCRIPTION_V1_ROUTE}/getActivePlanUsers?plan=${id}`)
    return res.data
}

export const deleteSubscriptionPlan = async (id: string) => {
    const res = await api.delete(`${SUBSCRIPTION_V1_ROUTE}/deleteSubscriptionPlan?plan=${id}`)
    return res.data
}

export const reportConnection = async (id: string, type: string) => {
    const res = await api.post(`${REPORT_V1_ROUTE}/reportUser?user=${id}&type=${type}`)
    return res.data
}

export const reportCompany = async (id: string, type: string) => {
    const res = await api.post(`${REPORT_V1_ROUTE}/reportCompany?company=${id}&type=${type}`)
    return res.data
}

export const reportMessage = async (sendBy: string, chatId: string, type: string) => {
    const res = await api.post(`${REPORT_V1_ROUTE}/reportMessage?sendBy=${sendBy}&chat=${chatId}&type=${type}`)
    return res.data
}

export const scheduleCall = async (data: any, companyId?: string | null) => {
    const res = await api.patch(`${CHAT_V1_ROUTE}/scheduleCall?company=${companyId}`, data)
    return res.data
}

export const sendScheduleMail = async (data: any) => {
    const res = await api.post(`${NOTIFICATION_V1_ROUTE}/sendScheduleMail`, data)
    return res.data
}

export const sendRemindMail = async (data: any) => {
    const res = await api.post(`${NOTIFICATION_V1_ROUTE}/sendRemindMail`, data)
    return res.data
}

export const userLogout = async () => {
    const res = await api.delete(`${USER_V1_ROUTE}/userLogout`)
    return res.data
}