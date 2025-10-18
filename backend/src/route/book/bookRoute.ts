import express from "express";
import multer from "multer";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";
import { sendBook } from "./controller/sendBook.js";
import { addBook } from "./controller/addBook.js";
import { borrowBook } from "./controller/borrowBook.js";

const upload = multer({ dest: "./coverimage/" });
const bookRoute = express.Router();

bookRoute.post("/add", upload.single("coverimg"), addBook);
bookRoute.post("/borrow", borrowBook);

bookRoute.get("/", sendBooks);
bookRoute.get("/:id", sendBook);
bookRoute.get("/:id/cover", sendCoverImg);

export { bookRoute };
