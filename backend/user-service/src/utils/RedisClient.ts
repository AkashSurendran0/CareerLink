import Redis from "ioredis";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

export const redisClient=new Redis({
    host: process.env.REDIS_HOST,
    port: 6379
});

redisClient.on("connect", ()=>{
    logger.info("Redis connected");
});

redisClient.on("error", (err)=>{
    logger.error({err} ,"Redis connection error");
});