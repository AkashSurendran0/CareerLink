"use client"

import React, { useState } from "react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useRouter } from "next/navigation";

function Login() {
    const router=useRouter()
    const {enqueueSnackbar}=useSnackbar()
    const [loginDetails, setLoginDetails]=useState({
        email:'',
        password:''
    })
    const [loginErrors, setLoginErrors]=useState<Partial<Record<"email" | "password", string>>>({})

    const setLoginChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setLoginDetails({...loginDetails, [e.target.name]:e.target.value})
    }

    const resetErrors=()=>{
        setLoginErrors({
            email:'',
            password:''
        })
    }

    const adminLogin = async () =>{
        resetErrors()

        if(!loginDetails.email){
            return setLoginErrors({email:'Email required'})
        }

        if (!loginDetails.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setLoginErrors({email:'Please enter a valid email address'})
            return 
        }

        if(!loginDetails.password){
            setLoginErrors({password:'Password required'})
            return
        }

        const result=await axios.post('http://localhost:5000/admin/login', loginDetails)
        if(!result.data.result.success){
            return enqueueSnackbar(result.data.result.message, {variant:'error'})
        }

        router.push('/admin/userManagement')
    }

        
    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex">
                <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-6">

                    <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        👋 Welcome, Admin!
                    </h2>
                    <p className="text-gray-600">Manage your platform with ease and efficiency.</p>
                    </div>

                    <div className="space-y-4">
                    <div className="space-y-2">
                        <input
                        type="email"
                        name="email"
                        value={loginDetails.email}
                        onChange={setLoginChange}
                        placeholder="Email"
                        className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {loginErrors.email && (
                        <p className="text-red-500 text-sm">{loginErrors.email}</p>
                    )}

                    <div className="space-y-2">
                        <input
                        type="password"
                        name="password"
                        value={loginDetails.password}
                        onChange={setLoginChange}
                        placeholder="Password"
                        className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {loginErrors.password && (
                        <p className="text-red-500 text-sm">{loginErrors.password}</p>
                    )}

                    <button className="w-full h-12 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={adminLogin}>
                        Login
                    </button>
                    </div>
                </div>
                </div>

                <div className="hidden lg:flex flex-1 items-center justify-center">
                <div className="w-80 h-80 rounded-lg border-0 flex items-center justify-center">
                    <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo.jpeg" alt="" width={300} height={300}/>
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
