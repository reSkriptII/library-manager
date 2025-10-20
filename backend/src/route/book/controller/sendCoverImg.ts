import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { readdir } from "fs/promises";
import mime from "mime-types";

export async function sendCoverImg(req: Request, res: Response) {
  const bookId = req.params.id;

  try {
    const imgDirPath = path.resolve("coverimage");
    const imgDir = await readdir(imgDirPath);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === bookId
    );
    if (filteredImgNames.length === 0) {
      return res.status(404).send("not found");
    }

    const coverImgPath = path.join(imgDirPath, filteredImgNames[0]);
    const contentType = mime.lookup(coverImgPath);

    if (!contentType || !contentType.startsWith("image/")) {
      return res.status(404).send("not found");
    }

    res.setHeader("Content-Type", contentType);
    fs.createReadStream(coverImgPath).pipe(res);
  } catch (err) {
    console.log(err);
  }
}
