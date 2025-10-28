import express from "express";
import { me } from "./controller/me.js";
import { authenticate } from "middleware/authenticate.js";
import { sendBorrowedBook } from "./controller/borrowedBook.js";

const userRoute = express.Router();

userRoute.get("/me", authenticate, me);
userRoute.get("/borrowedbook", authenticate, sendBorrowedBook);

export { userRoute };
