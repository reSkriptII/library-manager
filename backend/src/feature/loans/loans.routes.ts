import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { checkRole } from "../../middleware/checkRole.js";
import { loanBook, returnBook, getLoans } from "./loans.controller.js";

const router = Router();

router.get("/", authenticate, checkRole("librarian"), getLoans);
router.post("/", authenticate, checkRole("librarian"), loanBook);
router.post("/:id/return", authenticate, checkRole("librarian"), returnBook);

export default router;
