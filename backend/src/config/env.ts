import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().min(0).max(65535).default(5000),
  CORS_ORIGIN: z.string(),

  // database connection
  DATABASE_URL: z.url(),
  PGHOST: z.string(),
  PGPORT: z.coerce.number().min(1000).max(65535).default(5432),
  PGDATABASE: z.string(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),

  REDIS_URL: z.url(),
  REDIS_PASSWORD: z.string(),

  // jwt secret
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),

  // resource storage path
  AVATAR_IMAGE_DIR_PATH: z
    .string()
    .default(path.resolve("public", "image", "users")),
  COVER_IMAGE_DIR_PATH: z
    .string()
    .default(path.resolve("public", "image", "books")),
});
export type Environment = z.infer<typeof envSchema>;

// internal environment variable holder
let _env: Environment;

export function loadEnv(): Environment | null {
  try {
    // Validate process.env against the schema
    _env = envSchema.parse(process.env);
    console.log(`Environment variables loaded successfully.`);
    return _env;
  } catch (error) {
    // If validation fails, log error and return null
    console.error("Invalid environment variable:");
    console.error(error);
    process.exit(1);
  }
}

export function ENV() {
  if (!_env) {
    throw new Error("Environment variables not loaded.");
  }
  return _env;
}
