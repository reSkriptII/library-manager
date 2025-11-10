import { psqlPool } from "#src/util/db.js";
export { getUserById, isUserExist } from "#src/models/users.js";

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
