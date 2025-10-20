import express from "express";
import multer from "multer";

import { addBook } from "./controller/addBook.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";

const upload = multer({ dest: "./coverimage/" });
const adminRoute = express.Router();

adminRoute.post(
  "/add",
  authenticate,
  checkRole("admin"),
  upload.single("coverimg"),
  addBook
);

export { adminRoute };
