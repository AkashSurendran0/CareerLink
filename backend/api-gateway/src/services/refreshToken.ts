import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

type token = {
    id:string,
    email:string
}

export const refreshToken = async (req:Request, res:Response) => {
    // console.log(req.cookies)
    // const refreshToken=req.cookies?.refreshToken
    // console.log(1, refreshToken)
    const authHeader=req.headers.authorization
    const refreshToken=authHeader?.split(' ')[1]

    const decoded=jwt.verify(refreshToken, process.env.JWT_SECRET!) as token
    const newToken=jwt.sign(
        {id:decoded.id, email:decoded.email},
        process.env.JWT_SECRET!,
        {expiresIn: '1h'}
    )
    console.log(2, newToken)
    res.cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
    });
    console.log(3)
    return res.status(200).json({messge:'Token refreshed'})
}