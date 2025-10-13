import { readFileSync } from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const schemaPath = path.join(import.meta.dirname, "schema.sql");
const sampleDataPath = path.join(import.meta.dirname, "sampledata.sql");
const schema = readFileSync(schemaPath, { encoding: "utf-8" });
const sampleDataInsertQuery = readFileSync(sampleDataPath, {
  encoding: "utf-8",
});

const client = new Client();
await client.connect();

const res = await client.query(schema);
console.log(res);

await client.query(sampleDataInsertQuery);

client.end();
