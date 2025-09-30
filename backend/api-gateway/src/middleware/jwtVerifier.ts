import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader=req.headers.authorization
    if(!authHeader){
        return next()
    }
    console.log(authHeader)
    const token=authHeader.split(' ')[1]
    const decoded=jwt.verify(token, 'jwt_secret')
    console.log(decoded)
    req.headers['user-email']=decoded.email
    req.headers['user-id']=decoded.id
    next()
}