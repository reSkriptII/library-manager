import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/authenticate.js";
import { checkRole } from "../../middleware/checkRole.js";
import * as controllers from "./books.controllers.js";

const router = Router();
const upload = multer({ dest: "./public/image/books" });

// public
router.get("/", controllers.getBookList);

router.get("/:id/cover", controllers.getBookCover);

router.get("/authors", controllers.getAuthorList);
router.get("/genres", controllers.getGenreList);

router.get("/:id", controllers.getBookById);

// admin privilege
router.use(authenticate, checkRole("admin"));

router.post("/", upload.single("coverImage"), controllers.createBook);
router.put("/:id", controllers.updateBook);
router.delete("/:id", controllers.deleteBook);

router.put(
  "/:id/cover",
  upload.single("coverImage"),
  controllers.updateBookCover
);

router.post("/authors", controllers.createAuthor);
router.post("/genres", controllers.createGenre);

export default router;
