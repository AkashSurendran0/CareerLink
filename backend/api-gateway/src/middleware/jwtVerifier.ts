import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import dotenv from "dotenv";

dotenv.config();

type token = {
    id:string,
    email:string
}

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const authHeader=req.headers.authorization
    const refreshToken=req.cookies?.refreshToken
    if(!authHeader){
        return next()
    }
    const token=authHeader.split(' ')[1]
    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        req.headers['user-email']=decoded.email
        req.headers['user-id']=decoded.id
        return next()
    } catch (error:any) {
        if(error.name=="TokenExpiredError" && token){
            const newAccessToken=await refreshAccessToken(refreshToken)
            if(!newAccessToken){
                return res.status(401).json({message:"Invalid refresh token"})
            }
            try {
                const decoded=jwt.verify(newAccessToken, process.env.JWT_SECRET!) as token
                req.headers['user-email']=decoded.email
                req.headers['user-id']=decoded.id
                res.cookie("token", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000,
                });
                res.setHeader("access-token", newAccessToken)
                return next()
            } catch (error:any) {
                return res.status(401).json({ message: "Session expired. Please log in again." });
            }
        }
        return res.status(401).json({ message: "Invalid or missing token" });
    }
    
}

const refreshAccessToken = async (token:string) => {
    try {
        const refreshDecoded=jwt.verify(token, process.env.JWT_SECRET!) as token
        const newAccessToken=jwt.sign(
            {id:refreshDecoded.id, email:refreshDecoded.email},
            process.env.JWT_SECRET!,
            {expiresIn:'1h'}
        )
        return newAccessToken
    } catch (error: any) {
        console.error("Failed to refresh token:", error);
        return null;
    }
}

