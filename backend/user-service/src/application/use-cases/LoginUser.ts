import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class LoginUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository=userRepository
    }

    async execute(email:string, password:string): Promise<{success:boolean, token:string} | {success:boolean, message:string}> {
        const user=await this.userRepository.findByEmail(email)
        if(!user){
            return {
                success: false,
                message: 'User not found'
            }
        }
        console.log(user)
        const isMatch=await bcrypt.compare(password, user.password)
        console.log(isMatch)
        if(!isMatch){
            return {
                success: false,
                message: 'Invalid Credentials'
            }
        }

        const token=jwt.sign(
            {id:user.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )

        return {
                success:true, 
                token: token
            }
    }
}