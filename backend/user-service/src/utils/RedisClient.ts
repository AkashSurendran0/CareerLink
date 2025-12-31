import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient=new Redis({
    host: process.env.REDIS_HOST,
    port: 6379
});

redisClient.on("connect", ()=>{
    console.log("Redis connected");
});

redisClient.on("error", (err)=>{
    console.log("Redis connection error", err);
});