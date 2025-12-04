import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import booksRoutes from "./feature/books/books.routes.js";
import loansRoutes from "./feature/loans/loans.routes.js";
import usersRoutes from "./feature/users/users.routes.js";
import authRoutes from "./feature/auth/auth.routes.js";
import { ENV } from "./config/env.js";

const app = express();

app.use(cors({ origin: ENV().CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/books", booksRoutes);
app.use("/loans", loansRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});
app.use((err: any, req: any, res: express.Response, next: any) => {
  console.log(err);
  return res.status(500).send();
});

export { app };
