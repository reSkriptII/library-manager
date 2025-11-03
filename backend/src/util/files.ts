import { rm } from "fs/promises";
import path from "path";

export function cleanFile(file: Express.Multer.File | undefined) {
  if (file) {
    rm(path.resolve(file.path));
  }
}
