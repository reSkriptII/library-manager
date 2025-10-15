import express from "express";
import { authenticate } from "#util/authenticate.js";
import { me } from "./controller/me.js";
import { registerUser } from "./controller/registerUser.js";
import { login } from "./controller/login.js";

const authRoute = express.Router();

authRoute.get("/me", me);
authRoute.post("/login", login);
// authRoute.post("/logout");
authRoute.post("/register", registerUser);

export { authRoute };
