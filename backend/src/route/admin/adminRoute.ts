import express from "express";
import multer from "multer";

import { addBook } from "./controller/addBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";
import { addAuthor } from "./controller/addAuthor.js";
import { addGenre } from "./controller/addGenre.js";

const upload = multer({ dest: "./coverimage/" });
const adminRoute = express.Router();

adminRoute.use(authenticate, checkRole("admin"));

adminRoute.post("/addbook", upload.single("coverimg"), addBook);
adminRoute.post("/addauthor", addAuthor);
adminRoute.post("/addgenre", addGenre);

export { adminRoute };
