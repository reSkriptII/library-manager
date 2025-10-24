import express from "express";
import multer from "multer";

import { addBook } from "./controller/addBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";
import { addAuthor as createAuthor } from "./controller/createAuthor.js";
import { addGenre as createGenre } from "./controller/createGenre.js";
import { deleteBook } from "./controller/deleteBook.js";

const upload = multer({ dest: "./coverimage/" });
const adminRoute = express.Router();

adminRoute.use(authenticate, checkRole("admin"));

adminRoute.post("/addbook", upload.single("coverimg"), addBook);
adminRoute.post("/createauthor", createAuthor);
adminRoute.post("/creategenre", createGenre);
adminRoute.delete("/deletebook", deleteBook);

export { adminRoute };
