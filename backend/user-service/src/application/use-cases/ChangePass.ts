import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Mailer } from "../../utils/MailHelper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IChangePass } from "../../domain/use-cases/IUserUseCase";
import { ISendResetOtp } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";

@injectable()
export class ChangePass implements IChangePass {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) {}

    async changePass(email:string, password:string){
        const hashedPass=await bcrypt.hash(password, 10);
        const user=await this._userRepository.updateUserPassword(email, hashedPass);
        const token=jwt.sign(
            {id:user.id, email:email},
            "jwt_secret",
            {expiresIn: "1h"}
        );
        return token;
    }
}

export class SendResetOTP implements ISendResetOtp {

    constructor(@inject(TYPES.Mailer) private _mailer:Mailer, @inject(TYPES.IUserRepository) private _userRepository:IUserRepository){}

    async mailOtp(email:string):Promise<{success:boolean, message:string} | {success:boolean, otp:number}>{
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
        return {
            success:true, 
            otp:otp
        };
    }
}