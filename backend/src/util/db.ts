import { ENV } from "../config/env.js";
import { Pool } from "pg";
import { createClient } from "redis";

const redisClient = await createClient({
  url: ENV.REDIS_URL,
  password: ENV.REDIS_PASSWORD,
})
  .on("error", (err) => {
    console.log("Redis Client Error", err);
    process.abort();
  })
  .connect();

const psqlPool = new Pool();

export { psqlPool, redisClient };
