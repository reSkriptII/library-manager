import express from "express";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";
import { sendBook } from "./controller/sendBook.js";
import { authenticate } from "#util/authenticate.js";
import { checkRole } from "#util/checkRole.js";
import { reserveBook } from "./controller/reserveBook.js";

const bookRoute = express.Router();

bookRoute.get("/books", sendBooks);
bookRoute.get("/book/:id", sendBook);
bookRoute.get("/book/:id/cover", sendCoverImg);
bookRoute.post("/book/reserve", authenticate, checkRole("user"), reserveBook);

export { bookRoute };
