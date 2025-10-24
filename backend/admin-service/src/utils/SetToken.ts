import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createAccessToken=async (id:string, email:string)=>{
    console.log(process.env.JWT_SECRET)
    return jwt.sign(
        {id:id, email:email},
        process.env.JWT_SECRET!,
        {expiresIn:"1h"}
    );
};

export const createRefreshToken=async (id:string, email:string)=>{
    return jwt.sign(
        {id:id, email:email},
        process.env.JWT_SECRET!,
        {expiresIn:"7d"}
    );
};

