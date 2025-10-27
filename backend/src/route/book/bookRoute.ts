import express from "express";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";
import { sendBook } from "./controller/sendBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";
import { reserveBook } from "./controller/reserveBook.js";
import { sendAuthors } from "./controller/sendAuthors.js";
import { sendGenres } from "./controller/sendGenres.js";
import { deleteBook } from "./controller/deleteBook.js";
import { deleteProp } from "./controller/deleteProp.js";
import { addProp } from "./controller/addProp.js";

const bookRoute = express.Router();

bookRoute.get("/book/authors", sendAuthors);
bookRoute.get("/book/genres", sendGenres);
bookRoute.get("/books", sendBooks);
bookRoute.get("/book/:id", sendBook);
bookRoute.get("/book/:id/cover", sendCoverImg);
bookRoute.post("/book/reserve", authenticate, checkRole("user"), reserveBook);
bookRoute.delete(
  "/book/:id/delete",
  authenticate,
  checkRole("admin"),
  deleteBook
);
bookRoute.post(
  "/book/:id/:prop/:value",
  authenticate,
  checkRole("admin"),
  addProp
);
bookRoute.delete(
  "/book/:id/:prop/:value",
  authenticate,
  checkRole("admin"),
  deleteProp
);

export { bookRoute };
