"use client"

import React,{ useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Signup() {
    const router=useRouter()
    const {enqueueSnackbar}=useSnackbar()
    const [correctOtp, setCorrectOtp]=useState(false)
    const [sendOtp, setSendOtp]=useState(false)
    const [timeLeft, setTimeLeft]=useState(0)
    const [otp, setOtp]=useState<number>()
    const [signupForm, setSignupForm]=useState({
        username:'',
        email:'',
        password:'',
        confirmPass:''
    })
    const [errors, setErrors] = useState<Partial<Record<"username" | "email" | "otp" | "password" | "confirmPass", string>>>({});

    const clearErrors = () =>{
        setErrors({
            username: "",
            email: "",
            otp:"",
            password: "",
            confirmPass: ""
        });
    }
    const handleTimer = (expiry:number) => {
        const timeLeft=()=>Math.max(Math.floor((expiry-Date.now())/1000), 0)

        setTimeLeft(timeLeft())
        const id=setInterval(() => {
            setTimeLeft(()=>{
                const newTime=timeLeft()
                if(newTime<=1){
                    clearInterval(id)
                    setSendOtp(false)
                    setCorrectOtp(false)
                    localStorage.removeItem('signinDetails')
                    localStorage.removeItem('locked')
                    return 0
                }
                return newTime
            })
        }, 1000);
    }

    useEffect(()=>{
        const details=localStorage.getItem('signinDetails')
        if(details){
            const parsedDetails=JSON.parse(details) as {
                otp:number,
                email:string,
                expiry:number
            }
            if(parsedDetails.expiry>Date.now()){
                setSendOtp(true)
                signupForm.email=parsedDetails.email
                handleTimer(parsedDetails.expiry)
                const lock=localStorage.getItem('locked')
                if(lock){
                    setOtp(parsedDetails.otp)
                    setCorrectOtp(true)
                }
            }else{
                localStorage.removeItem('signinDetails')
                localStorage.removeItem('locked')
            }
        }
        
        return ()=> {
            localStorage.removeItem('signinDetails')
            localStorage.removeItem('locked')
        }
    }, [])

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const details=localStorage.getItem('signinDetails')
        if(details){
            const parsedDetails=JSON.parse(details) as {
                otp:number,
                email:string,
                expiry:number
            }
            if(e.target.value==parsedDetails.otp.toString()){
                setCorrectOtp(true)
                const locked={
                    otp:true
                }
                localStorage.setItem('locked', JSON.stringify(locked))
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setSignupForm({...signupForm, [e.target.name]:e.target.value})
    }


    const sendOTP = async () =>{
        console.log(signupForm)
        if (!signupForm.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrors({email:'Please enter a valid email address'})
            return 
        }

        const data={
            email:signupForm.email
        }

        const result=await axios.post('http://localhost:5000/user/sendOTP', data)
        const expiry=Date.now()+60*1000
        const emailDetails={
            otp: result.data.otp,
            email: signupForm.email,
            expiry,
        }
        handleTimer(emailDetails.expiry)
        localStorage.setItem('signinDetails', JSON.stringify(emailDetails))
        setSendOtp(true)
    }

    const userSignup = async () => {
        clearErrors()

        if(!signupForm.username){
            setErrors({username:'Username Required'})
            return
        }

        if (!/^[A-Za-z]{3,}$/.test(signupForm.username)) {
            setErrors({username:'Please enter a valid Username'})
            return
        }

        if(!localStorage.getItem('signinDetails')){
            setErrors({otp: 'OTP expired'})
            return
        }

        if(!correctOtp){
            setErrors({otp:'Please enter a valid OTP'})
            return
        }

        if(!signupForm.password){
            setErrors({password:'Password required'})
            return
        }

        if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{3,}$/.test(signupForm.password)) {
            setErrors({password:'Password must be at least 3 characters, with at least 1 number and 1 special character'})
            return 
        }

        if (signupForm.password !== signupForm.confirmPass) {
            setErrors({confirmPass:'Passwords do not match'})
            return
        }

        const result=await axios.post('http://localhost:5000/user/signup', signupForm)
        if(!result.data.token.success){
            return enqueueSnackbar(result.data.token.message, {variant:'error'})
        }

        router.push('/feed')
    }

    const googleSignup = async () =>{
        window.location.href='http://localhost:5000/user/google'
    }


    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex">
                <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-6">

                    <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Create Your Account 🚀
                    </h2>
                    <p className="text-gray-600">Join the community today.</p>
                    </div>

                    <div className="space-y-4">
                    <div className="space-y-2">
                        <input
                        type="string"
                        name="username"
                        value={signupForm.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                    )}

                    <div className="flex justify-between space-x-2">
                        <input
                        type="email"
                        name="email"
                        value={signupForm.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${sendOtp? 'opacity-50':''}`}
                        disabled={sendOtp? true:false}
                        />
                        <button className={`w-50 ${sendOtp? `${correctOtp? 'bg-green-600':'bg-gray-600'}`:'bg-blue-600'} cursor-pointer text-white h-12 rounded-lg ${sendOtp? '':'hover:bg-blue-700'}`} onClick={sendOTP}>{sendOtp? `${correctOtp? 'Verified': `${timeLeft}`}`:'Get OTP'}</button>
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}


                    <div className="space-y-2">
                        <input
                        type="number"
                        name="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter OTP"
                        className={`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${sendOtp? '':'opacity-50'} ${correctOtp? 'opacity-50':''}`}
                        disabled={!sendOtp || correctOtp}
                        />
                    </div>
                    {errors.otp && (
                        <p className="text-red-500 text-sm">{errors.otp}</p>
                    )}


                    <div className="space-y-2">
                        <input
                        type="password"
                        name="password"
                        value={signupForm.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className={`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${correctOtp? '':'opacity-50'}`}
                        disabled={correctOtp? false:true}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                    )}

                    <div className="space-y-2">
                        <input
                        type="password"
                        name="confirmPass"
                        value={signupForm.confirmPass}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className={`w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${correctOtp? '':'opacity-50'}`}
                        disabled={correctOtp? false:true}
                        />
                    </div>
                    {errors.confirmPass && (
                        <p className="text-red-500 text-sm">{errors.confirmPass}</p>
                    )}

                    <button className="w-full h-12 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={userSignup}>
                        Signup
                    </button>
                    </div>

                    <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-600">or</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <button className="w-full h-12 bg-white border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 cursor-pointer" onClick={googleSignup}>
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
                    <span>Signup with Google</span>
                    </button>

                    <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Already have an account?
                        <button className="text-blue-600 hover:underline cursor-pointer">
                        <Link href={'/login'}>Login</Link>
                        </button>
                    </span>
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

export default Signup;
