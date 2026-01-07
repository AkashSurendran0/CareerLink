import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.token;
    
    if (!accessToken) {
        return next();
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET! as string) as unknown;

        if (typeof decoded === "object" && decoded !== null) {
            const email = (decoded as { email?: unknown }).email;
            const id = (decoded as { id?: unknown }).id;

            if (typeof email === "string") req.headers["user-email"] = email;
            if (typeof id === "string") req.headers["user-id"] = id;
        }

        return next();
    } catch (error: unknown) {
        const name = typeof error === "object" && error !== null && "name" in error ? (error as { name?: unknown }).name : undefined;
        if (typeof name === "string" && name === "TokenExpiredError") {
            return res.status(440).json({
                message: "session_over"
            });
        }

        return res.status(401).json({
            message: "invalid_token"
        });
    }
};

    


 