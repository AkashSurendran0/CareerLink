"use client"

import React, {useState, useEffect} from "react";
import Image from "next/image";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLoading } from "../../template";

function ForgotPassword() {
    const setLoading=useLoading()
    const router=useRouter()
    const {enqueueSnackbar}=useSnackbar()
    const [correctOtp, setCorrectOtp]=useState(false)
    const [sendOtp, setSendOtp]=useState(false)
    const [timeLeft, setTimeLeft]=useState(0)
    const [otp, setOtp]=useState<number>()
    const [signupForm, setSignupForm]=useState({
        email:'',
        password:'',
        confirmPass:''
    })
    const [errors, setErrors] = useState<Partial<Record<"email" | "otp" | "password" | "confirmPass", string>>>({});

    const clearErrors = () =>{
        setErrors({
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

        const result=await axios.post('http://localhost:5000/user/sendResetOTP', data)
        if(!result.data.otp.success){
            return enqueueSnackbar(result.data.otp.message, {variant:'error'})
        }
        const expiry=Date.now()+60*1000
        const emailDetails={
            otp: result.data.otp.otp,
            email: signupForm.email,
            expiry,
        }
        handleTimer(emailDetails.expiry)
        localStorage.setItem('signinDetails', JSON.stringify(emailDetails))
        setSendOtp(true)
    }

    const resetPassword = async () => {
        clearErrors()

        if(!signupForm.email){
            setErrors({email:'Email Required'})
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

        setLoading(true)

        const result=await axios.post('http://localhost:5000/user/changePassword', signupForm)

        localStorage.setItem('token', result.data.token)
        router.push('/feed')
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex">
                <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-6">

                    <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Reset your password 🔒
                    </h2>
                    <p className="text-gray-600">Enter your email to continue.</p>
                    </div>

                    <div className="space-y-4">

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

                    <button className="w-full h-12 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer" onClick={resetPassword}>
                        Reset Password
                    </button>
                    </div>

                    <div className="text-center">
                    <span className="text-sm text-gray-600">
                        Back to Login?
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

export default ForgotPassword;
