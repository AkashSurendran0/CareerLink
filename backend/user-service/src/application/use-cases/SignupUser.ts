import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Mailer } from "../../utils/MailHelper";
import { ISignupUser } from "../../domain/use-cases/IUserUseCase";
import { ISendOtp } from "../../domain/use-cases/IUserUseCase";

export class SignupUser implements ISignupUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository=userRepository
    }

    async createUser(username:string, email:string, password:string): Promise<{success:boolean, token:string}> {
        const hashedPass=await bcrypt.hash(password, 10)
        const user=new User(
            '',
            username,
            email, 
            hashedPass,
            '',
            false
        )
        const newuser=await this.userRepository.create(user)
        const token=jwt.sign(
            {id:newuser.id, email:email},
            'jwt_secret',
            {expiresIn: '3h'}
        )
        return {
                success:true, 
                token: token
            }
    }
}

export class SendOTP implements ISendOtp {
    private mailer:Mailer
    private userRepository:IUserRepository

    constructor(userRepository:IUserRepository){
        this.mailer=new Mailer()
        this.userRepository=userRepository
    }

    async mailOtp(email:string):Promise<{success:boolean, otp:number} | {success:boolean, message:string}>{
        const userExists=await this.userRepository.findByEmail(email)
        if(userExists){
            return {
                success:false, 
                message:'User already exists'
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
            otp
        }
    }
}