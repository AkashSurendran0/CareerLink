import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILoginUser } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { createAccessToken, createRefreshToken } from "../../utils/SetToken";

@injectable()
export class LoginUser implements ILoginUser {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) {}

    async execute(email:string, password:string): Promise<{success:boolean, token:string, refreshToken:string} | {success:boolean, message:string}> {
        const user=await this._userRepository.findByEmail(email);
        if(!user){
            return {
                success: false,
                message: "User not found"
            };
        }
        if(user.suspended){
            return {
                success:false,
                message: "User entry restricted"
            };
        }
        if(!user.password){
            return {
                success:false,
                message:"Credentials doesnt exists for this user"
            };
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return {
                success: false,
                message: "Invalid Credentials"
            };
        }

        const token=await createAccessToken(user.id, email);
        const refreshToken=await createRefreshToken(user.id, email);

        return {
                success:true, 
                token: token,
                refreshToken: refreshToken
            };
    }
}