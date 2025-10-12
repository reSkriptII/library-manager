import express from "express";

import { sendBooks } from "./controller/sendBooks.js";
import { sendCoverImg } from "./controller/sendCoverImg.js";

const bookRoute = express.Router();

bookRoute.get("/", sendBooks);
bookRoute.get("/:id/cover", sendCoverImg);

export { bookRoute };
