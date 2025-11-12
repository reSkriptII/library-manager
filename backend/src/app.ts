import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import { bookRoute } from "./route/book/bookRoute.js";

// import { libRoute } from "./route/librarian/librarianRoute.js";
// import { adminRoute } from "./route/admin/adminRoute.js";
// import { userRoute } from "route/user/userRoute.js";

import books from "./feature/books/books.routes.js";
import loans from "./feature/loans/loans.routes.js";
import users from "./feature/users/users.routes.js";
import auth from "./feature/auth/auth.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/books", books);
app.use("/loans", loans);
app.use("/users", users);
app.use("/auth", auth);

export { app };
