import { psqlPool } from "#src/util/db.js";

export function isUserUsed({ email, name }: { email: string; name: string }) {
  return psqlPool
    .query("SELECT 1 FROM users WHERE email = $1 OR name = $2", [email, name])
    .then((r) => Boolean(r.rows.length));
}

export type CreatUserDetails = {
  name: string;
  email: string;
  hashedPassword: string;
  role: UserRole;
};
export async function createUser({
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
