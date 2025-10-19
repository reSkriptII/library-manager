import express from "express";
import multer from "multer";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";
import { sendBook } from "./controller/sendBook.js";
import { addBook } from "./controller/addBook.js";
import { borrowBook } from "./controller/borrowBook.js";
import { returnBook } from "./controller/returnBook.js";
import { authenticate } from "#util/authenticate.js";
import { checkRole } from "#util/checkRole.js";

const upload = multer({ dest: "./coverimage/" });
const bookRoute = express.Router();

bookRoute.post(
  "/add",
  authenticate,
  checkRole("admin"),
  upload.single("coverimg"),
  addBook
);
bookRoute.post("/borrow", authenticate, checkRole("librarian"), borrowBook);
bookRoute.post("/return", authenticate, checkRole("librarian"), returnBook);

bookRoute.get("/", sendBooks);
bookRoute.get("/:id", sendBook);
bookRoute.get("/:id/cover", sendCoverImg);

export { bookRoute };
