import express from "express";

import { borrowBook } from "./controller/borrowBook.js";
import { returnBook } from "./controller/returnBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";

const libRoute = express.Router();

libRoute.post("/borrow", authenticate, checkRole("librarian"), borrowBook);
libRoute.post("/return", authenticate, checkRole("librarian"), returnBook);

export { libRoute };
