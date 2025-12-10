import { psqlPool } from "../../util/db.js";

type UserData = {
  id: number;
  name: string;
  email: string;
  hashed_password: string;
  role: "member" | "librarian" | "admin";
};

/** ge user data from database filtered by by unique email in WHERE clause
 *
 * @param {string} email - an unique email of an user
 * @return {UserData} an user data object from database
 */
export function getUserByEmail(email: string) {
  return psqlPool
    .query(
      "SELECT user_id as id, name, email, hashed_password, role FROM users WHERE email = $1",
      [email]
    )
    .then((r) => r.rows[0] as UserData);
}

/** check to database if user with exact email or name exist
 *
 * email and name search are default to null and ignored if not provide
 * @param {string} email - an unique email of an user
 * @param {string} name -a name of an user
 * @return {boolean}
 */
export function isUserUsed({ email, name }: { email: string; name: string }) {
  return psqlPool
    .query("SELECT 1 FROM users WHERE email = $1 OR name = $2", [
      email ?? null,
      name ?? null,
    ])
    .then((r) => Boolean(r.rows.length));
}
