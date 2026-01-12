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

redisClient.on("ready", () => {
    logger.info("Redis ready");
});

redisClient.on("error", (err) => {
    logger.error({ err }, "Redis connection error");
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        logger.error({ err }, "Redis failed to connect");
    }
})();