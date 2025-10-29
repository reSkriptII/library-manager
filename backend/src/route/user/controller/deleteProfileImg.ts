import path from "path";
import { readdir, rm } from "fs/promises";
import type { Request, Response } from "express";

export async function deleteProfileImg(req: Request, res: Response) {
  const userId = req.user?.id as number;

  try {
    const imgDirPath = path.resolve("userprofile");
    const imgDir = await readdir(imgDirPath);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === String(userId)
    );
    filteredImgNames.forEach((img) => rm(path.join(imgDirPath, img)));
  } catch (err) {
    console.log(err);
  }
}
