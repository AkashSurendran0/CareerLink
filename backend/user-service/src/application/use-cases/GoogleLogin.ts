import { IUserRepository } from "../../domain/repositories/IUserRepository";
import jwt from 'jsonwebtoken'
import { IGoogleLogin } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from 'inversify'
import { TYPES } from "../../types";

@injectable()
export class GoogleLogin implements IGoogleLogin {

    constructor(@inject(TYPES.IUserRepository) private _userRepository:IUserRepository){}

    async googleSignin (email:string, googleId:string, username:string) : Promise<string> {
        let user=await this._userRepository.findByEmail(email)
        if(!user){
            user=await this._userRepository.createUserWithGoogle(email, googleId, username)
        }

        const token=jwt.sign(
            {id:user.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )
        
        return token
    }
}