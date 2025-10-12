import { readFileSync } from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const schemaPath = path.join(import.meta.dirname, "schema.sql");
const schema = readFileSync(schemaPath, { encoding: "utf-8" });

const client = new Client();
await client.connect();

try {
  const res = await client.query(schema);
  console.log(res);
} catch (err) {
  console.log(err);
}

client.end();
