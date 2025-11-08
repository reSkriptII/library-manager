import { authenticate } from "#src/middleware/authenticate.js";
import { checkRole } from "#src/middleware/checkRole.js";
import { Router } from "express";
import multer from "multer";
import * as controllers from "./user.controller.js";

const router = Router();
router.use(authenticate);

router.get("/me", controllers.getMe);
router.get("/me/avatar", controllers.getMyAvatar);
router.put("me/avatar", controllers.updateAvatar);
router.delete("me/avatar", controllers.deleteAvatar);

router.use(checkRole("librarian"));

router.get(":id", controllers.getUserById);
router.get("/:id/avatar", controllers.getAvatar);

router.use(checkRole("admin"));

router.put("/:id/name", controllers.setUserName);
router.put("/:id/role", controllers.setUserRole);
router.delete("/:id", controllers.deleteAvatar);

export default router;
