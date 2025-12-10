import { ENV } from "../config/env.js";
import { Pool } from "pg";
import { createClient } from "redis";

// --- redis ---

const redisClient = await createClient({
  url: ENV().REDIS_URL,
  password: ENV().REDIS_PASSWORD,
})
  .on("error", (err) => {
    console.log("Redis Client Error", err);
    process.abort();
  })
  .connect();

// --- postgreSQL ---

const psqlPool = new Pool({
  connectionString: ENV().DATABASE_URL,
  user: ENV().PGUSER,
  password: ENV().PGPASSWORD,
  host: ENV().PGHOST,
  port: ENV().PGPORT,
  database: ENV().PGDATABASE,
});

export { psqlPool, redisClient };
