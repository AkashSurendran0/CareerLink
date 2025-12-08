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

type Amount = {
    amount:number
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

export const getAllCompanyJob = async (startingPage:number, limit:number, query:string, filter:string) => {
    const res=await api.get(`job/v1/getAllJobs?start=${startingPage}&limit=${limit}&query=${query}&filter=${filter}`)
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

export const closeJob = async (id:string) => {
    const res=await api.patch(`job/v1/closeJob?id=${id}`)
    return res.data
}

export const getAllJobs = async (query:string) => {
    const res=await api.get(`job/v1/getAvailableJobs?query=${query}`)
    return res.data
}

export const createResume = async (data:any) => {
    const res=await api.post('resume/v1/createResume', data)
    return res.data
}

export const saveResume = async (data:any) => {
    const res=await api.post('resume/v1/saveResume', data, {
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
    return res.data
}

export const getAllUserResumes = async () => {
    const res=await api.get('resume/v1/getAllUserResumes')
    return res.data
}

export const createCoverLetter = async (data:any) => {
    const res=await api.post('resume/v1/createCoverLetter', data)
    return res.data
}

export const applyJobWithUrl = async (data:any) => {
    const res=await api.post('job/v1/applyJobWithUrl', data)
    return res.data
}

export const applyJobWithFile = async (formData:any) => {
    const res=await api.post('job/v1/applyJobWithFile', formData, {
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
    return res.data
}

export const getUserAppliedJobs = async () => {
    const res=await api.get('job/v1/getUserAppliedJobs')
    return res.data
}

export const getJobApplicants = async (id:string) => {
    const res=await api.get(`job/v1/getJobApplicants?job=${id}`)
    return res.data
}

export const postContent = async (formData:any) => {
    const res=await api.post('media/v1/postContent', formData, {
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
    return res.data
}

export const getAllPosts = async (limit:number, shown:number) => {
    const res=await api.get(`media/v1/getAllPosts?lim=${limit}&shown=${shown}`)
    return res.data
}

export const alterPostLike = async (postId:string) => {
    const res=await api.patch(`media/v1/alterPostLike?post=${postId}`)
    return res.data
}

export const addComment = async (data:any) => {
    const res=await api.patch('media/v1/addComment', data)
    return res.data 
}

export const loadSinglePostDetails = async (id:string) => {
    const res=await api.get(`media/v1/getSinglePostDetails?post=${id}`)
    return res.data
}

export const getAllUserPosts = async () => {
    const res=await api.get('media/v1/getAllUserPosts')
    return res.data
}

export const deleteUserPost = async (id:string) => {
    const res=await api.delete(`media/v1/deletePost?id=${id}`)
    return res.data
}

export const getTailoredResume = async (id:string) => {
    const res=await api.post(`resume/v1/getTailoredResume?job=${id}`)
    return res.data
}

export const getTailoredCoverLetter = async (id:string) => {
    const res=await api.post(`resume/v1/getTailoredCoverLetter?job=${id}`)
    return res.data
}

export const getGithubData = async (username:string) => {
    const res=await api.get(`user/v1/getGithubData?user=${username}`)
    return res.data
}

export const getGithubActivity = async (username:string) => {
    const res=await api.get(`user/v1/getGithubActivity?user=${username}`)
    return res.data
}

export const getUserRepos = async (page:number, username:string, limit:number) => {
    const res=await api.get(`user/v1/getGithubRepo?page=${page}&user=${username}&limit=${limit}`)
    return res.data
}

export const getActivePlans = async () => {
    const res=await api.get('subscription/v1/getActivePlans')
    return res.data
}

export const getOrderId = async (data:Amount) => {
    const res=await api.post('subscription/v1/create-order', data)
    return res.data
}

export const verifyPayment = async (response:any) => {
    const res=await api.post('subscription/v1/verifyPayment', response)
    return res.data
}

export const stripePayment = async (data:Amount) => {
    const res=await api.post('subscription/v1/createStripePayment', data)
    return res.data
}

export const buyPremium = async (id:string, time:number) => {
    const res=await api.post(`subscription/v1/buyPremium?id=${id}&time=${time}`)
    return res.data
}

export const getUserPlan = async () => {
    const res=await api.get('subscription/v1/getUserPlan')
    return res.data
}

export const cancelSubscription = async () => {
    const res=await api.delete('subscription/v1/deletePlan')
    return res.data
}

export const getSubscriptionInfo = async () => {
    const res=await api.get('subscription/v1/getSubscriptionInfo')
    return res.data
}

export const getConnectionUsers = async () => {
    const res=await api.get('user/v1/getUnconnectedUsers')
    return res.data
}

export const sendConnectionRequest = async (id:string) => {
    const res=await api.patch(`user/v1/sendConnectionRequest?user=${id}`)
    return res.data
}

export const viewOtherUserDetails = async (id:string) => {
    const res=await api.get(`/user/v1/getUserDetails?user=${id}`)
    return res.data
}

export const viewOtherUserPosts = async (id:string) => {
    const res=await api.get(`media/v1/getAllUserPosts?user=${id}`)
    return res.data
}