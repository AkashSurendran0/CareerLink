import Redis from "ioredis";
import dotenv from "dotenv";
import { logger } from "./logger";
import { createClient } from "redis";

dotenv.config();

export const redisClient=createClient({
    url: process.env.REDIS_URL as string
});

redisClient.on("connect", ()=>{
    logger.info("Redis connected");
});

redisClient.on("error", (err)=>{
    logger.error({err} ,"Redis connection error");
});