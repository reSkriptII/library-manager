import { Router } from "express";
import * as controllers from "./auth.controllers.js";
import { authenticate } from "#src/middleware/authenticate.js";
import { checkRole } from "#src/middleware/checkRole.js";

const router = Router();

router.post("/login", controllers.login);
router.post("/logout", authenticate, controllers.logout);

router.post(
  "/register",
  authenticate,
  checkRole("librarian"),
  controllers.registerUser
);

export default router;
