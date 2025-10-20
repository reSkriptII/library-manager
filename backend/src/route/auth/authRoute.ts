import express from "express";
import { authenticate } from "middleware/authenticate.js";
import { me } from "./controller/me.js";
import { registerUser } from "./controller/registerUser.js";
import { login } from "./controller/login.js";
import { logout } from "./controller/logout.js";

const authRoute = express.Router();

authRoute.get("/me", authenticate, me);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/register", registerUser);

export { authRoute };
