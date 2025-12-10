import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { checkRole } from "../../middleware/checkRole.js";
import * as controllers from "./auth.controllers.js";

const router = Router();

router.post("/login", controllers.login);
router.post("/logout", authenticate, controllers.logout);

export default router;
