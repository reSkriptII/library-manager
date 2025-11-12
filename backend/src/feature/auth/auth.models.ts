import { psqlPool } from "#src/util/db.js";

type UserData = {
  id: number;
  name: string;
  email: string;
  hashed_password: string;
  role: "member" | "librarian" | "admin";
};

export function getUserByEmail(email: string) {
  return psqlPool
    .query(
      "SELECT user_id as id, name, email, hashed_password, role FROM users WHERE email = $1",
      [email]
    )
    .then((r) => r.rows[0] as UserData);
}

export type CreatUserDetails = {
  name: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
};
export function createUser({
  name,
  email,
  hashedPassword,
  role,
}: CreatUserDetails) {
  return psqlPool
    .query(
      `INSERT INTO users (name, email, hashed_password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id as id`,
      [name, email, hashedPassword, role]
    )
    .then((r) => r.rows[0].id as number);
}

export function isUserUsed({ email, name }: { email: string; name: string }) {
  return psqlPool
    .query("SELECT 1 FROM users WHERE email = $1 OR name = $2", [
      email ?? null,
      name ?? null,
    ])
    .then((r) => Boolean(r.rows.length));
}
