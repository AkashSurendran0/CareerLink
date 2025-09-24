import { IUserRepository } from "../../domain/repositories/IUserRepository";
import jwt from 'jsonwebtoken'
import { IGoogleLogin } from "../../domain/use-cases/IUserUseCase";

export class GoogleLogin implements IGoogleLogin {
    private _userRepository:IUserRepository

    constructor(userRepository: IUserRepository){
        this._userRepository=userRepository
    }

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