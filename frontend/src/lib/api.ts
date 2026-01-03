import axios from 'axios'

const apiGatewayRoute = process.env.NEXT_PUBLIC_API_GATEWAY_ROUTE
const frontedRoute = process.env.NEXT_PUBLIC_FRONTEND_ROUTE

const api=axios.create({
    baseURL:apiGatewayRoute,
    withCredentials:true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

api.interceptors.request.use(
    (config)=>{
        console.log(apiGatewayRoute, frontedRoute)
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
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            const url = error.config?.url;

            console.error("📡 Response Error:", { status, data, url });

            if (status === 440 || data?.message === "session_over") {
                if (typeof window !== "undefined") {
                    window.location.href = `${frontedRoute}/sessionOver`;
                }
                return; 
            }
        } 
        else if (error.request) {
            console.error("🌐 Network Error:", error.message);
        } 
        else {
            console.error("⚙️ Request Setup Error:", error.message);
        }

        return Promise.reject(error);
    }
);



export default api