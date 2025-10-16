import { readFileSync } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const schemaPath = path.join(import.meta.dirname, "schema.sql");
const schema = readFileSync(schemaPath, { encoding: "utf-8" });

const client = new Client();
await client.connect();

await client.query(schema);
console.log("successfully create posgreSQL database");

await populateUserTable;
console.log("successfully insert sample data");

client.end();

async function populateUserTable() {
  const users = [
    {
      name: "user",
      email: "user@test.com",
      password: "user1234",
    },
    {
      name: "librarian",
      email: "librarian@test.com",
      password: "librarian1234",
    },
    {
      name: "admin",
      email: "admin@test.com",
      password: "admin1234",
    },
  ];

  for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);

    await client.query(
      `INSERT INTO users (name, email, hashed_password, role)
        VALUES ($1, $2, $3, $4)`,
      [user.name, user.email, hashedPassword, user.name]
    );
  }
}
