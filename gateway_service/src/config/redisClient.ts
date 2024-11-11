import { createClient } from "redis";
import dotenv from "dotenv";
import { loggerGateway } from "../logger/logger";
dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    loggerGateway.info("Redis client connected");
  } catch (err) {
    loggerGateway.error("Redis connection error:", err);
    process.exit(1); // Exit the process if Redis connection fails
  }
};

const closeRedis = async () => {
  try {
    await redisClient.quit();
    loggerGateway.info("Redis client disconnected");
  } catch (err) {
    loggerGateway.error("Error during Redis disconnect:", err);
  }
};

export { redisClient, connectRedis, closeRedis };
