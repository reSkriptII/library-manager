import express from "express";
import multer from "multer";

import { addBook } from "../book/controller/addBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";
import { addAuthor as createAuthor } from "./controller/createAuthor.js";
import { addGenre as createGenre } from "./controller/createGenre.js";

const adminRoute = express.Router();

adminRoute.use(authenticate, checkRole("admin"));

adminRoute.post("/createauthor", createAuthor);
adminRoute.post("/creategenre", createGenre);

export { adminRoute };
