export interface IChangePass {
    changePass(email:string, password:string): Promise<string>
}

export interface ISendResetOtp {
    mailOtp(email:string): Promise<{success:boolean, message:string} | {success:boolean, otp:number}>
}

export interface IGoogleLogin {
    googleSignin(email:string, googleId:string, username:string) : Promise<string>
}

export interface ILoginUser {
    execute(email:string, password:string): Promise<{success:boolean, token:string} | {success:boolean, message:string}>
}

export interface ISignupUser {
    createUser(username:string, email:string, password:string): Promise<{success:boolean, token:string} | {success:boolean, message:string}> 
}

export interface ISendOtp {
    mailOtp(email:string):Promise<{success:boolean, otp:number} | {success:boolean, message:string}>
}

export interface IGetAllUsers {
    getUsers(page:number, limit:number, query:string | undefined):Promise<{result: {id:string, username:string, email:string, status:boolean, createdAt:Date|undefined}[], pageLimit:number }>
}

export interface IVerifyOTP {
    verifyOtp(email:string): Promise<{success:boolean, otp:string} | {success:boolean, message:string}>
}