import express from "express";
import { me } from "./controller/me.js";
import { authenticate } from "middleware/authenticate.js";

const userRoute = express.Router();

userRoute.get("/me", authenticate, me);

export { userRoute };
