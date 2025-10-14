import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { bookRoute } from "./route/book/bookRoute.js";
import { authRoute } from "./route/auth/authRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/book", bookRoute);
app.use("/auth", authRoute);

app.listen(5000);
