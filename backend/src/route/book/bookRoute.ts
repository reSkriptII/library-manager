import express from "express";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";
import { sendBook } from "./controller/sendBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";
import { reserveBook } from "./controller/reserveBook.js";
import { sendAuthors } from "./controller/sendAuthors.js";
import { sendGenres } from "./controller/sendGenres.js";

const bookRoute = express.Router();

bookRoute.get("/book/authors", sendAuthors);
bookRoute.get("/book/genres", sendGenres);
bookRoute.get("/books", sendBooks);
bookRoute.get("/book/:id", sendBook);
bookRoute.get("/book/:id/cover", sendCoverImg);
bookRoute.post("/book/reserve", authenticate, checkRole("user"), reserveBook);

export { bookRoute };
