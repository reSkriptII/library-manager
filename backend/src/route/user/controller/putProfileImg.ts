import { copyFile, rm, readdir } from "fs/promises";
import path from "path";
import mime from "mime-types";
import type { Request, Response } from "express";
import { sendResponse } from "#util/sendResponse.js";

export async function putProfileImg(req: Request, res: Response) {
  const userId = req.user?.id as number;

  try {
    if (req.file && req.file.mimetype.split("/")[0] === "image") {
      const imgDirPath = path.resolve("userprofile");
      const imgDir = await readdir(imgDirPath);

      const filteredImgNames = imgDir.filter(
        (file) => path.parse(file).name === String(userId)
      );
      filteredImgNames.forEach((img) => rm(path.join(imgDirPath, img)));

      const destFileName = userId + "." + mime.extension(req.file.mimetype);
      const srcFilePath = path.join(process.cwd(), req.file.path);
      const destFilePath = path.join(
        process.cwd(),
        "userprofile",
        destFileName
      );

      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (req.file) {
      rm(path.join(process.cwd(), req.file.path));
    }
    return sendResponse(res, true);
  }
}
