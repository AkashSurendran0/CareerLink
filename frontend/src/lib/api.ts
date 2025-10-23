import axios from 'axios'

const api=await axios.create({
    baseURL:"http://localhost:5000",
    withCredentials:true
})

api.interceptors.request.use(
    (config)=>{
        const openRoutes=["/user/v1/login", "/user/v1/signup", "/user/v1/changePassword", "/user/v1/getOTP", "/user/v1/sendOTP", "/user/v1/google", "/user/v1/sendResetOTP", "/admin/v1/login"]

        const isOpenRoute=openRoutes.some((route)=>
            config.url?.includes(route)
        )

        if(!isOpenRoute) {
            config.withCredentials=true 
        }

        return config
    },
    (error)=>Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error)
    }
);

export default api