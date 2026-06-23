import Redis from "ioredis";

let redis = null;

export const connectRedis = async () => {

    try {

        redis = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });

        await redis.ping();

        console.log("Redis Connected");

    }
    catch (err) {

        console.error(
            "Redis Connection Failed:",
            err.message
        );

    }

};

export const getRedis = () => redis;