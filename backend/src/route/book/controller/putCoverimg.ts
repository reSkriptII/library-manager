import { copyFile, rm } from "fs/promises";
import path from "path";
import mime from "mime-types";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function putCoverImg(req: Request, res: Response) {
  const { id } = req.params;
  console.log(req.params);
  if (!id) {
    return sendResponse(res, false, 400, "bad input");
  }

  try {
    if (req.file && req.file.mimetype.split("/")[0] === "image") {
      console.log("gotfile");
      const destFileName = id + "." + mime.extension(req.file.mimetype);
      const srcFilePath = path.join(process.cwd(), req.file.path);
      const destFilePath = path.join(process.cwd(), "coverimage", destFileName);

      await copyFile(srcFilePath, destFilePath);
    }
  } finally {
    if (req.file) {
      rm(path.join(process.cwd(), req.file.path));
    }
  }
}
