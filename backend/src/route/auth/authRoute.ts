import express from "express";
import { me } from "./controller/me.js";
import { registerUser } from "./controller/registerUser.js";

const authRoute = express.Router();

authRoute.get("/me", me);
// authRoute.post("/login");
// authRoute.post("/logout");
authRoute.post("/register", registerUser);

export { authRoute };
