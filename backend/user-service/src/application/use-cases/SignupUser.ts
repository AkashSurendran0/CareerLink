import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class SignupUser {
    private userRepository: IUserRepository

    constructor(userRepository: IUserRepository){
        this.userRepository=userRepository
    }

    async createUser(username:string, email:string, password:string): Promise<string> {
        const hashedPass=await bcrypt.hash(password, 10)
        const user=new User(
            '',
            username,
            email, 
            hashedPass,
            false
        )
        const newuser=await this.userRepository.create(user)
        const token=jwt.sign(
            {id:newuser.id, email:email},
            'jwt_secret',
            {expiresIn: '1h'}
        )
        return token
    }
}