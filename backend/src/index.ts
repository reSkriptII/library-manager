import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { bookRoute } from "./route/book/bookRoute.js";
import { authRoute } from "./route/auth/authRoute.js";
import { libRoute } from "route/librarian/librarianRoute.js";
import { adminRoute } from "route/admin/adminRoute.js";

const app = express();
if (!process.env.REFRESH_TOKEN_SECRET) {
  process.abort();
}
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", bookRoute);
app.use("/", authRoute);

app.use("/lib", libRoute);
app.use("/admin", adminRoute);

app.listen(5000);
