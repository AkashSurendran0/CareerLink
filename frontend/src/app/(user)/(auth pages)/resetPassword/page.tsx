import React from "react";
import Image from "next/image";

function Login() {
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

                <div className="flex justify-between space-y-2 space-x-2">
                    <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="w-50 bg-blue-600 cursor-pointer text-white h-12 rounded-lg hover:bg-blue-700">Get OTP</button>
                </div>

                <div className="space-y-2">
                    <input
                    type="number"
                    placeholder="Enter OTP"
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button className="w-full h-12 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    Reset Password
                </button>
                </div>

                <div className="text-center">
                <span className="text-sm text-gray-600">
                    Back to Login?{" "}
                    <button className="text-blue-600 hover:underline cursor-pointer">
                    Login
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

export default Login;
