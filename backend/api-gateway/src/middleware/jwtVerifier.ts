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
    const decoded=jwt.verify(accessToken, process.env.JWT_SECRET)
    req.headers['user-email']=decoded.email
    req.headers['user-id']=decoded.id
    return next()
}

export const adminAuthMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const accessToken=req.cookies?.adminToken
    console.log(accessToken)
    if(!accessToken){
        return next()
    }
    const decoded=jwt.verify(accessToken, process.env.JWT_ADMIN_SECRET)
    req.headers['admin-email']=decoded.email
    req.headers['admin-id']=decoded.id
    return next()
}
    


 