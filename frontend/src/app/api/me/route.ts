import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

export async function GET(){
    const cookieStore=await cookies()
    const token=cookieStore.get('token')?.value

    if(!token){
        return Response.json({userEmail:null}, {status:401})
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET!)
        return Response.json({userEmail:decoded.email})
    } catch (error) {
        return Response.json({userEmail:null}, {status:401})
    }
}