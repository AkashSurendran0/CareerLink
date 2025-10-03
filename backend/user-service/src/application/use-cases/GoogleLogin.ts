import { IUserRepository } from "../../domain/repositories/IUserRepository";
import jwt from "jsonwebtoken";
import { IGoogleLogin } from "../../domain/use-cases/IUserUseCase";
import {inject, injectable} from "inversify";
import { TYPES } from "../../types";
import { elasticClient } from "../../utils/ElasticClient";

@injectable()
export class GoogleLogin implements IGoogleLogin {

    constructor(@inject(TYPES.IUserRepository) private _userRepository:IUserRepository){}

    async googleSignin (email:string, googleId:string, username:string) : Promise<string> {
        let user=await this._userRepository.findByEmail(email);
        if(!user){
            user=await this._userRepository.createUserWithGoogle(email, googleId, username);
            try {
                await elasticClient.index({
                    index:"users",
                    id:user.id.toString(),
                    document:{
                        id:user.id,
                        username:user.username,
                        email:user.email,
                        createdAt:user.createdAt,
                        suspended:user.suspended    
                    }
                });

                await elasticClient.indices.refresh({ index: "users" });
            } catch (error:any) {
                console.log("Cant insert into elasticsearch", error);
            }
        }

        const token=jwt.sign(
            {id:user.id, email:email},
            "jwt_secret",
            {expiresIn: "1h"}
        );
        
        return token;
    }
}