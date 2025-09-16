import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Mailer } from "../../utils/MailHelper";

export class SignupUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository=userRepository
    }

    async createUser(username:string, email:string, password:string): Promise<string | {success:boolean, message:string}> {
        const userExists=await this.userRepository.findByEmail(email)
        if(userExists){
            return {
                success:false, 
                message:'User already exists'
            }
        }
        const hashedPass=await bcrypt.hash(password, 10)
        const user=new User(
            '',
            username,
            email, 
            hashedPass,
            false
        )
        const newuser=await this.userRepository.create(user)
        const token=jwt.sign(
            {id:newuser.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )
        return token
    }
}

export class SendOTP {
    private mailer:Mailer

    constructor(){
        this.mailer=new Mailer()
    }

    async mailOtp(email:string):Promise<number>{
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
        return otp
    }
}