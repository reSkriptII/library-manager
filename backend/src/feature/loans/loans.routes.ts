import { authenticate } from "#src/middleware/authenticate.js";
import { checkRole } from "#src/middleware/checkRole.js";
import { Router } from "express";
import { loanBook, returnBook, getLoans } from "./loans.controller.js";

const router = Router();

router.get("/", authenticate, checkRole("librarian"), getLoans);
router.post("/", authenticate, checkRole("librarian"), loanBook);
router.patch("/:id/return", authenticate, checkRole("librarian"), returnBook);

export default router;
