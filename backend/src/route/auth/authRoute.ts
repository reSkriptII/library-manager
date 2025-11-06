import express from "express";
import { authenticate } from "#src/middleware/authenticate.js";
import { registerUser } from "./controller/registerUser.js";
import { login } from "./controller/login.js";
import { logout } from "./controller/logout.js";
import { checkRole } from "#src/middleware/checkRole.js";

const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/register", authenticate, checkRole("librarian"), registerUser);

export { authRoute };
