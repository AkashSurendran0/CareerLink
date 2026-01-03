"use client"

import React, { useState } from "react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoading } from "../../template";
import { loginUser } from "@/services/userService";

const apiGatewayRoute=process.env.NEXT_PUBLIC_API_GATEWAY_ROUTE

function Login() {
    const setLoading=useLoading()
    const router=useRouter()
    const {enqueueSnackbar}=useSnackbar()
    const [loginDetails, setLoginDetails]=useState({
        email: '',
        password: ''
    })
    const [errors, setErrors]=useState<Partial<Record<"email" | "password", string>>>({})


    const resetErrors= () =>{
        setErrors({
            email:'',
            password:''
        })
    }

    const setLoginForm = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setLoginDetails({...loginDetails, [e.target.name]:e.target.value})
    }

    const userSignin = async () =>{
        resetErrors()

        if (!loginDetails.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrors({email:'Please enter a valid email address'})
            return 
        }

        if(!loginDetails.password){
            setErrors({password:'Password required'})
            return
        }

        setLoading(true)

        const result=await loginUser(loginDetails)
        if(!result.result.success){
            setLoading(false)
            return enqueueSnackbar(result.result.message, {variant:'error'})

        }

        router.push('/feed')
    }

    const googleLogin = async () =>{
        window.location.href=`${apiGatewayRoute}/user/v1/google`
    }
 
    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex">
                <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-6">

                    <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Welcome back 👋
                    </h2>
                    <p className="text-gray-600">Login to continue.</p>
                    </div>

                    <div className="space-y-4">
                    <div className="space-y-2">
                        <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={loginDetails.email}
                        onChange={setLoginForm}
                        className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}

                    <div className="space-y-2">
                        <input
                        type="password"
                        name="password"
                        value={loginDetails.password}
                        onChange={setLoginForm}
                        placeholder="Password"
                        className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                    )}

                    <div className="text-left">
                        <button className="text-sm text-blue-600 hover:underline cursor-pointer">
                        <Link href={'/resetPassword'}>Forgot password?</Link>
                        </button>
                    </div>

                    <button className="w-full h-12 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={userSignin}>
                        Login
                    </button>
                    </div>

                    <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-600">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <button className="w-full h-12 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 cursor-pointer" onClick={googleLogin}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span>Continue with Google</span>
                    </button>

                    <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Dont have an account?{" "}
                        <button className="text-blue-600 hover:underline cursor-pointer">
                        <Link href={'/signup'}>Sign Up</Link>
                        </button>
                    </span>
                    </div>
                </div>
                </div>

                <div className="hidden lg:flex flex-1 items-center justify-center">
                <div className="w-80 h-80 rounded-lg border-0 flex items-center justify-center">
                    <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <Image src="https://res.cloudinary.com/djhmcbiq9/image/upload/v1767428371/logo_na1hkt.jpg" alt="" width={300} height={300}/>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default Login;
