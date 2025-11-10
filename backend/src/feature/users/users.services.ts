import { readdir, rm, copyFile } from "fs/promises";
import path from "path";
import mime from "mime-types";
import { FileError } from "#src/util/error.js";
import * as models from "./users.models.js";
import {} from "#src/models/users.js";
import { searchLoans } from "#src/models/loans.js";

export async function getAvatarData(id: number) {
  try {
    const imgDir = await readdir(AVATAR_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name == String(id)
    );
    if (filteredImgNames.length === 0) {
      return null;
    }

    const coverImgPath = path.join(AVATAR_IMAGE_DIR_PATH, filteredImgNames[0]);
    const mimeType = mime.lookup(coverImgPath);

    if (!mimeType || !mimeType.startsWith("image/")) {
      return null;
    }
    return { mimeType, path: coverImgPath };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "ENOENT" || err.code === "EACCES") {
        throw new FileError(
          err.code,
          AVATAR_IMAGE_DIR_PATH,
          "GET /books/:id/cover"
        );
      }
    }
    throw err;
  }
}

export async function updateAvatar(
  id: number | string,
  file?: Express.Multer.File | undefined
) {
  try {
    const imgDir = await readdir(AVATAR_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === id
    );
    filteredImgNames.forEach((img) =>
      rm(path.join(AVATAR_IMAGE_DIR_PATH, img))
    );

    if (file != undefined) {
      const destFileName = id + "." + mime.extension(file.mimetype);
      const srcFilePath = path.resolve(file.path);
      const destFilePath = path.join(AVATAR_IMAGE_DIR_PATH, destFileName);

      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "ENOENT" || err.code === "EACCES") {
        throw new FileError(
          err.code,
          AVATAR_IMAGE_DIR_PATH,
          "GET /users/*/avartar"
        );
      }
    }
    throw err;
  }
}
export async function setUserName(id: number, name: string) {
  if (!(await models.isUserExist(id))) {
    return { ok: false, status: 404, message: "User not found" };
  }
  await models.setUserName(id, name);
}

export async function setUserRole(id: number, role: UserRole) {
  if (!(await models.isUserExist(id))) {
    return { ok: false, status: 404, message: "User not found" };
  }
  await models.setUserRole(id, role);
}

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

export async function getMyLoan(id: number) {
  const loans = await searchLoans({ borrowerId: id });

  return loans.map((loan) => ({
    id: loan.loan_id,
    bookId: loan.book_id,
    borrowerId: loan.borrower_id,
    borrowTime: loan.borrow_time.toISOString(),
    dueDate: loan.due_date.toISOString(),
    returned: loan.return_time != null,
    isLateReturn:
      loan.return_time == null ? null : loan.return_time > loan.due_date,
    returnTime: loan.due_date.toISOString(),
  }));
}

const AVATAR_IMAGE_DIR_PATH = path.resolve("public", "image", "users");
