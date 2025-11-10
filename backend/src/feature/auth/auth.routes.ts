import { Router } from "express";
import * as controllers from "./auth.controllers.js";
import { authenticate } from "#src/middleware/authenticate.js";

const router = Router();

router.get("/login", controllers.login);
router.post("/logout", authenticate, controllers.logout);

export default router;
