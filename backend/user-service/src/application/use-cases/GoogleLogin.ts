import { IUserRepository } from "../../domain/repositories/IUserRepository";
import jwt from 'jsonwebtoken'

export class GoogleLogin {
    private userRepository:IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository=userRepository
    }

    async googleSignin (email:string, googleId:string, username:string) : Promise<string> {
        let user=await this.userRepository.findByEmail(email)
        if(!user){
            user=await this.userRepository.createUserWithGoogle(email, googleId, username)
        }

        const token=jwt.sign(
            {id:user.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )
        
        return token
    }
}