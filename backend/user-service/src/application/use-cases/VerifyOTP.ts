import { injectable } from "inversify";
import { redisClient } from "../../utils/RedisClient";
import { IVerifyOTP } from "../../domain/use-cases/IUserUseCase";

@injectable()
export class VerifyOTP implements IVerifyOTP {

    async verifyOtp (email:string): Promise<{success:boolean, otp:string} | {success:boolean, message:string}> {
        const cachedOtp=await redisClient.get(`keyFor${email}`);
        console.log(cachedOtp, "otp");
        if(!cachedOtp){
            return {
                success:false,
                message:"Otp expired"
            };
        }
        return {
            success:true,
            otp:cachedOtp
        };
    }

}