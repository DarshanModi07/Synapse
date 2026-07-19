import Redis from "ioredis";

let redis = null;

export const connectRedis = async () => {
    try {
        redis = new Redis(process.env.REDIS_URL);

        await redis.ping();

        console.log("Connected to Redis Successfully!");
    } catch (err) {
        console.error(
            "Redis Connection Failed:",
            err.message
        );
    }
};

export const getRedis = () => redis;