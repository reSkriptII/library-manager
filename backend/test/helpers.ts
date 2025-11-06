import request from "supertest";
import { app } from "#src/index.ts";

export async function login() {
  const login = await request(app).post("/login").send({
    email: "admin@test.com",
    password: "admin1234",
  });
  if (login.status != 200) return null;
  return login.headers["set-cookie"] as unknown as string[];
}

export async function logout(cookies: string[]) {
  await request(app).post("/logout").set("Cookie", cookies);
}
