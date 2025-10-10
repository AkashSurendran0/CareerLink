import axios from 'axios'

const api=await axios.create({
    baseURL:"http://localhost:5000",
    withCredentials:true
})

axios.interceptors.request.use(
    (config)=>{
        const openRoutes=["/user/v1/login", "/user/v1/signup", "/user/v1/changePassword", "/user/v1/getOTP", "/user/v1/sendOTP", "/user/v1/google", "/user/v1/sendResetOTP"]

        const isOpenRoute=openRoutes.some((route)=>
            config.url?.includes(route)
        )

        if(!isOpenRoute) {
            const token=localStorage.getItem('token')
            if(token){
                config.headers.Authorization=`Bearer ${token}`
            }
        }

        return config
    },
    (error)=>Promise.reject(error)
)

axios.interceptors.response.use(
    (response)=>{
        const newToken=response.headers["access-token"] || response.data?.accessToken

        if(newToken){
            localStorage.setItem('token', newToken)
            document.cookie=`token=${newToken}; path=/; SameSite=strict`
        }

        return response
    },
    (error)=>Promise.reject(error)
)

export default api