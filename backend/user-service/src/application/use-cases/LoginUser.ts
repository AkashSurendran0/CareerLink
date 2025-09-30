import { IUserRepository } from "../../domain/repositories/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILoginUser } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";

@injectable()
export class LoginUser implements ILoginUser {

    constructor(@inject(TYPES.IUserRepository) private _userRepository: IUserRepository) {}

    async execute(email:string, password:string): Promise<{success:boolean, token:string} | {success:boolean, message:string}> {
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
                message: 'User entry restricted'
            }
        }
        console.log(user);
        const isMatch=await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if(!isMatch){
            return {
                success: false,
                message: "Invalid Credentials"
            };
        }

        const token=jwt.sign(
            {id:user.id, email:email},
            "jwt_secret",
            {expiresIn: "1h"}
        );

        return {
                success:true, 
                token: token
            };
    }
}