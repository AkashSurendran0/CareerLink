import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Mailer } from "../../utils/MailHelper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IChangePass } from "../../domain/use-cases/IUserUseCase";
import { ISendResetOtp } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { redisClient } from "../../utils/RedisClient";
import { createAccessToken, createRefreshToken } from "../../utils/SetToken";

@injectable()
export class ChangePass implements IChangePass {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) {}

    async changePass(email:string, password:string):Promise<{token: string, refreshToken:String}>{
        const hashedPass=await bcrypt.hash(password, 10);
        const user=await this._userRepository.updateUserPassword(email, hashedPass);
        const token=await createAccessToken(user.id, email);
        const refreshToken=await createRefreshToken(user.id, email);
        return {
            token:token,
            refreshToken:refreshToken
        };
    }
}

export class SendResetOTP implements ISendResetOtp {

    constructor(@inject(TYPES.Mailer) private _mailer:Mailer, @inject(TYPES.IUserRepository) private _userRepository:IUserRepository){}

    async mailOtp(email:string):Promise<{success:boolean, message:string} | {success:boolean}>{
        const userExists=await this._userRepository.findByEmail(email);
        if(!userExists){
            return {
                success:false, 
                message:"User doesnt exists"
            };
        }
        const otp=Math.floor(100000 + Math.random() * 900000);
        const data={
            to: email,
            subject: "Your CareerLink OTP Code 🔑",
            text: `Hello,
                    Your One-Time Password (OTP) for CareerLink is: ${otp}
                    This OTP is valid for 1 minute. Please do not share it with anyone.
                    If you did not request this, please ignore this email.

                    Thanks,  
                    The CareerLink Team 🚀`
        };
        await this._mailer.sendMail(data.to, data.subject, data.text);
        const cacheKey=`keyFor${email}`;
        await redisClient.set(cacheKey, JSON.stringify(otp), "EX", 60);
        return {
            success:true, 
        };
    }
}