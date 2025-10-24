import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const accessToken=req.cookies?.token
    console.log(accessToken)
    if(!accessToken){
        return next()
    }
    console.log('blahhh', process.env.JWT_SECRET)
    const decoded=jwt.verify(accessToken, process.env.JWT_SECRET)
    console.log(decoded, 'as')
    req.headers['user-email']=decoded.email
    req.headers['user-id']=decoded.id
    return next()
}
    


 