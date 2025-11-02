import { Router } from "express";
import multer from "multer";
import * as controllers from "./books.controllers.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";

const router = Router();
const upload = multer({ dest: "./public/image/books" });

// public
router.get("/", controllers.getBookList);
router.get("/:id", controllers.getBookById);

router.get("/:id/cover", controllers.getBookCover);

router.get("/authors", controllers.getAuthorList);
router.get("/genres", controllers.getGenreList);

// admin privilege
router.use(authenticate);
router.use(checkRole("admin"));

router.post("/", upload.single("coverImage"), controllers.createBook);
router.patch("/:id", controllers.editBook);
router.delete("/:id", controllers.deleteBook);

router.put("/:id/cover", controllers.updateBookCover);

router.post("/authors", controllers.createAuthor);
router.post("/genres", controllers.createGenre);

export default router;
