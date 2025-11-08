import { authenticate } from "#src/middleware/authenticate.js";
import { checkRole } from "#src/middleware/checkRole.js";
import { Router } from "express";
import multer from "multer";

const router = Router();
router.use(authenticate);

router.get("/me");
router.get("/me/avatar");
router.put("me/avatar");
router.delete("me/avatar");

router.use(checkRole("librarian"));

router.get(":id");
router.get("/:id/avatar");

router.use(checkRole("admin"));

router.put("/:id/name");
router.put("/:id/role");
router.delete("/:id");

export default router;
