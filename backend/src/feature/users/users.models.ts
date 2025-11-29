import { psqlPool } from "../../util/db.js";
import type { UserData } from "./users.types.js";

export { isUserExist } from "../../models/users.js";

export function getUserById(id: number) {
  return psqlPool
    .query(
      `SELECT user_id as id, name, email, role
      FROM users
      WHERE user_id = $1`,
      [id]
    )
    .then((r) => r.rows[0] as UserData);
}

type SearchUser = {
  name?: string | null;
  email?: string | null;
  role?: UserRole | null;
};
export function searchUserExist(search: SearchUser) {
  const { name = null, email = null, role = null } = search;
  return psqlPool
    .query(
      `SELECT 1 FROM users
    WHERE ($1::text IS NULL OR name = $1)
      AND ($2::text IS NULL OR email= $2)
      AND ($3::user_role IS NULL OR role = $3)`,
      [name, email, role]
    )
    .then((r) => Boolean(r.rows[0]));
}

export function createUser(
  name: string,
  email: string,
  hashedPassword: string
) {
  return psqlPool
    .query(
      "INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING user_id",
      [name, email, hashedPassword]
    )
    .then((r) => r.rows[0]?.user_id as number);
}

export function setUserName(id: number, name: string) {
  return psqlPool.query("UPDATE users SET name = $2 WHERE user_id = $1", [
    id,
    name,
  ]);
}
export function setUserRole(id: number, role: UserRole) {
  return psqlPool.query("UPDATE users SET role = $2 WHERE user_id = $1", [
    id,
    role,
  ]);
}

export function deleteUser(id: number) {
  return psqlPool.query("DELETE FROM users WHERE user_id = $1", [id]);
}

export function isUserHasActiveLoan(userId: number) {
  return psqlPool
    .query(
      "SELECT 1 FROM loans WHERE borrower_id = $1 AND return_time = null",
      [userId]
    )
    .then((r) => Boolean(r.rows.length));
}
