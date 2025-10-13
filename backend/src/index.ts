import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { bookRoute } from "./route/bookRoute/bookRoute.js";

const app = express();

app.use(cors());
app.get("/", (req, res) => res.send("test"));

app.use("/book", bookRoute);

app.listen(5000);
