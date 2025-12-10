import { readdir, rm, copyFile } from "fs/promises";
import path from "path";
import mime from "mime-types";
import bcrypt from "bcrypt";
import { ENV } from "../../config/env.js";
import { searchLoans } from "../../models/loans.js";
import { FileError } from "../../util/error.js";
import * as models from "./users.models.js";

/** get a path to avatar image of a user and a file type
 *
 * @param id - user id.
 * @returns {object | null} an object with structure {mimeType: string, path: string}.
 * return null if not found
 */
export async function getAvatarData(id: number) {
  try {
    const imgDir = await readdir(ENV().AVATAR_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name == String(id)
    );
    if (filteredImgNames.length === 0) {
      return null;
    }

    const coverImgPath = path.join(
      ENV().AVATAR_IMAGE_DIR_PATH,
      filteredImgNames[0]
    );
    const mimeType = mime.lookup(coverImgPath);

    if (!mimeType || !mimeType.startsWith("image/")) {
      return null;
    }
    return { mimeType, path: coverImgPath };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // directory not found or access error
      if (err.code === "ENOENT" || err.code === "EACCES") {
        throw new FileError(
          err.code,
          ENV().AVATAR_IMAGE_DIR_PATH,
          "GET /books/:id/cover"
        );
      }
    }
    throw err;
  }
}

/** replace user avatar image of a user
 *
 * delete avatar image if no file founded
 *
 * @param {number} id - user id used as avatar file name
 * @param {Express.Multer.File} req.file - an avatar image file parsed by multer
 */
export async function updateAvatar(
  id: number | string,
  file?: Express.Multer.File | undefined
) {
  try {
    const imgDir = await readdir(ENV().AVATAR_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === String(id)
    );

    // delete all exised image
    // avoid duplication image for a user with different file extension
    filteredImgNames.forEach((img) =>
      rm(path.join(ENV().AVATAR_IMAGE_DIR_PATH, img))
    );

    // write a file to storage
    if (file != undefined) {
      const destFileName = id + "." + mime.extension(file.mimetype);
      const srcFilePath = path.resolve(file.path);
      const destFilePath = path.join(ENV().AVATAR_IMAGE_DIR_PATH, destFileName);

      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "ENOENT" || err.code === "EACCES") {
        // directory not found or access error
        throw new FileError(
          err.code,
          ENV().AVATAR_IMAGE_DIR_PATH,
          "GET /users/*/avartar"
        );
      }
    }
    throw err;
  }
}

/** create a new user.
 *
 * store a hashed password with bcrypt with round 10
 * @return {object} an object with a flag 'ok: boolean' and new user id or error message
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const [isNameUsed, isEmailUsed] = await Promise.all([
    models.searchUserExist({ name }),
    models.searchUserExist({ email }),
  ]);
  console.log(isNameUsed, isEmailUsed);
  if (isNameUsed) {
    return { ok: false, message: "name already exist" };
  }
  if (isEmailUsed) {
    return { ok: false, message: "email already used" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUserId = await models.createUser(name, email, hashedPassword);
    return { ok: true, id: newUserId };
  } catch (err: any) {
    if (err instanceof Error && "code" in err) {
      if (String(err.code).startsWith("23")) {
        return { ok: false, message: "Error creating user" };
      }
    }
    throw err;
  }
}

/** set name of a user
 *
 * @param {number} id - user id
 * @param {string} name
 * @returns an object with a flag 'ok: boolean' and, on error, http status and error message
 */
export async function setUserName(id: number, name: string) {
  if (!(await models.isUserExist(id))) {
    return { ok: false, status: 404, message: "User not found" };
  }
  await models.setUserName(id, name);
  return { ok: true };
}

/** set role of a user
 *
 * @param {number} id - user id
 * @param {UserRole} role
 * @returns an object with a flag 'ok: boolean' and, on error, http status and error message
 */
export async function setUserRole(id: number, role: UserRole) {
  if (!(await models.isUserExist(id))) {
    return { ok: false, status: 404, message: "User not found" };
  }
  await models.setUserRole(id, role);
  return { ok: true };
}

/** delete an user
 *
 * @param {number} id
 * @returns {object} an object with a flag 'ok: boolean' and, on error, http status and error message
 */
export async function deleteUser(id: number) {
  if (!(await models.isUserExist(id))) {
    return { ok: false, status: 404, message: "User not found" };
  }
  if (await models.isUserHasActiveLoan(id)) {
    return {
      ok: false,
      status: 409,
      message: "User has borrowed books. Please return borrowed books first",
    };
  }
  await deleteUser(id);
  return { ok: true };
}

/** search loans of a user and structure it for response
 *
 * @id - user id
 */
export async function getMyLoan(id: number) {
  const loans = await searchLoans({ borrowerId: id });

  return loans.map((loan) => ({
    id: loan.loan_id,
    bookId: loan.book_id,
    bookTitle: loan.title,
    borrowerId: loan.borrower_id,
    borrowTime: loan.borrow_time.toISOString(),
    dueDate: loan.due_date.toISOString(),
    returned: loan.return_time != null,
    isLateReturn:
      loan.return_time == null ? null : loan.return_time > loan.due_date,
    returnTime: loan.due_date.toISOString(),
  }));
}
