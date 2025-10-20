import { Pool } from "pg";
import { createClient } from "redis";

const redisClient = await createClient({
  //url: String(process.env.REDIS_URL),
})
  .on("error", (err) => {
    console.log("Redis Client Error", err);
    process.abort();
  })
  .connect();
await redisClient.set("test", "hi");
const psqlPool = new Pool();

export { psqlPool, redisClient };
