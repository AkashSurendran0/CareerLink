import { createClient } from "redis";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});

let isConnected = false;

export async function connectRedis() {
  if (isConnected) return;

  redisClient.on("connect", () => {
    logger.info("Redis connected");
  });

  redisClient.on("ready", () => {
    logger.info("Redis ready");
  });

  redisClient.on("error", (err) => {
    logger.error({ err }, "Redis connection error");
  });

  await redisClient.connect();
  isConnected = true;
}
