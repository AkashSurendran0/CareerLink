import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Mailer } from "../../utils/MailHelper";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class ChangePass {
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.userRepository=userRepository
    }

    async changePass(email:string, password:string){
        const hashedPass=await bcrypt.hash(password, 10)
        const user=await this.userRepository.updateUserPassword(email, hashedPass)
        const token=jwt.sign(
            {id:user.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )
        return token
    }
}

export class SendResetOTP {
    private mailer:Mailer
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.mailer=new Mailer()
        this.userRepository=userRepository
    }

    async mailOtp(email:string):Promise<{success:boolean, message:string} | {success:boolean, otp:number}>{
        const userExists=await this.userRepository.findByEmail(email)
        if(!userExists){
            return {
                success:false, 
                message:'User doesnt exists'
            }
        }
        const otp=Math.floor(100000 + Math.random() * 900000)
        const data={
            to: email,
            subject: 'Your CareerLink OTP Code 🔑',
            text: `Hello,
                    Your One-Time Password (OTP) for CareerLink is: ${otp}
                    This OTP is valid for 1 minute. Please do not share it with anyone.
                    If you did not request this, please ignore this email.

                    Thanks,  
                    The CareerLink Team 🚀`
        }
        await this.mailer.sendMail(data.to, data.subject, data.text)
        return {
            success:true, 
            otp:otp
        }
    }
}