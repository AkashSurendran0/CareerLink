import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class LoginUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository=userRepository
    }

    async execute(email:string, password:string): Promise<string> {
        const user=await this.userRepository.findByEmail(email)
        if(!user){
            throw new Error('No user found')
        }

        const isMatch=await bcrypt.compare(password, user.password)
        if(!isMatch){
            throw new Error('Incorrect Password')
        }

        const token=jwt.sign(
            {id:user.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )

        return token
    }
}