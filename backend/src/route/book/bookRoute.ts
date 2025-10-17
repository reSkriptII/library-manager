import express from "express";
import multer from "multer";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";
import { sendBook } from "./controller/sendBook.js";
import { addBook } from "./controller/addBook.js";

const upload = multer({ dest: "./coverimage/" });
const bookRoute = express.Router();

bookRoute.get("/", sendBooks);
bookRoute.get("/:id", sendBook);
bookRoute.get("/:id/cover", sendCoverImg);
bookRoute.post("/add", upload.single("coverimg"), addBook);

export { bookRoute };
