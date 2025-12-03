import { Pool } from "pg";
import { createClient } from "redis";

const redisClient = await createClient({
  url: String(process.env.REDIS_URL),
  password: process.env.REDIS_PASSWORD,
})
  .on("error", (err) => {
    console.log("Redis Client Error", err);
    process.abort();
  })
  .connect();

const psqlPool = new Pool();

export { psqlPool, redisClient };
