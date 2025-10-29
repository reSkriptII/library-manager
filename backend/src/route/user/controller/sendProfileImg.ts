import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { readdir } from "fs/promises";
import mime from "mime-types";

export async function sendProfileImg(
  userId: number,
  req: Request,
  res: Response
) {
  try {
    const imgDirPath = path.resolve("userprofile");
    const imgDir = await readdir(imgDirPath);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === String(userId)
    );
    if (filteredImgNames.length === 0) {
      return res.status(404).send("not found");
    }

    const imgPath = path.join(imgDirPath, filteredImgNames[0]);
    const contentType = mime.lookup(imgPath);

    if (!contentType || !contentType.startsWith("image/")) {
      return res.status(404).send("not found");
    }

    res.setHeader("Content-Type", contentType);
    fs.createReadStream(imgPath).pipe(res);
  } catch (err) {
    console.log(err);
  }
}
