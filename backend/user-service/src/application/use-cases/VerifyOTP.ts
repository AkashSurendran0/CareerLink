import { injectable } from "inversify";
import { redisClient } from "../../utils/RedisClient";
import { IVerifyOTP } from "../../domain/use-cases/IUserUseCase";

@injectable()
export class VerifyOTP implements IVerifyOTP {

    async verifyOtp (email:string, otp:string): Promise<{success:boolean, match:boolean} | {success:boolean, message:string}> {
        const cachedOtp=await redisClient.get(`keyFor${email}`);
        if(!cachedOtp){
            return {
                success:false,
                message:"Otp expired"
            };
        }
        if(cachedOtp!==otp){
            return {
                success:true,
                match:false
            };
        }
        if(cachedOtp===otp){
            await redisClient.del(`keyFor${email}`);
            return {
                success:true,
                match:true
            };
        }
        return {
            success:false,
            message:"Something went wrong"
        };
    }

}