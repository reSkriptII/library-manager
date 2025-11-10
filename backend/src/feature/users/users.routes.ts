import { authenticate } from "#src/middleware/authenticate.js";
import { checkRole } from "#src/middleware/checkRole.js";
import { Router } from "express";
import multer from "multer";
import * as controllers from "./users.controller.js";

const router = Router();
const upload = multer({ dest: "./public/image/user" });

router.use(authenticate);

router.get("/me", controllers.getMe);
router.get("/me/avatar", controllers.getMyAvatar);
router.put("me/avatar", upload.single("avatar"), controllers.updateAvatar);
router.delete("me/avatar", controllers.updateAvatar);

router.get("/me/loans", controllers.getMyLoan);

router.use(checkRole("librarian"));

router.get("/:id", controllers.getUserById);
router.get("/:id/avatar", controllers.getAvatar);

router.use(checkRole("admin"));

router.put("/:id/name", controllers.setUserName);
router.put("/:id/role", controllers.setUserRole);
router.delete("/:id", controllers.deleteUser);

export default router;
