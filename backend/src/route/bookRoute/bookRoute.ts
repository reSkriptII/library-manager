import fs from "fs";
import { readdir } from "fs/promises";
import path from "path";
import express from "express";
import mime from "mime-types";

const bookRoute = express.Router();

bookRoute.get("/", (req, res) => {
  res.json(books);
});

bookRoute.get("/:id/cover", async (req, res) => {
  const bookId = req.params.id;

  try {
    const imgDirPath = path.resolve("coverimage");
    const imgDir = await readdir(imgDirPath);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === bookId
    );
    if (filteredImgNames == undefined) {
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
});

export { bookRoute };

const books = [
  {
    id: 1,
    title: "bookTitle",
    author: "Jonh Doe",
    genre: ["genre1", "genre2"],
    available: true,
  },
];
