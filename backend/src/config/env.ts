import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string) {
  const value = process.env[key];
  if (value !== "string")
    throw new Error("Missing environment variable: " + key);
  return value;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  // DATABASE_URL: requireEnv("DATABASE_URL")
  ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: requireEnv("REFERSH_TOKEN_SECRET"),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
