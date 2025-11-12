import request from "supertest";
import { app } from "#src/app.ts";

const account = {
  admin: {
    email: "admin@test.com",
    password: "admin1234",
  },
  librarian: {
    email: "libralian@test.com",
    password: "librarian1234",
  },
  user: {
    email: "user@test.com",
    password: "user1234",
  },
};

const tokens: { admin?: string[]; librarian?: string[]; user?: string[] } = {};
export async function login(acc: "admin" | "librarian" | "user") {
  if (tokens[acc]) {
    return tokens[acc];
  }
  const login = await request(app).post("/auth/login").send({
    email: account[acc].email,
    password: account[acc].password,
  });
  if (login.status != 204) return null;
  const token = login.headers["set-cookie"] as unknown as string[];
  tokens[acc] = token;
  return token;
}
