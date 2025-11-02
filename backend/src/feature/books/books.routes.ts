import { Router } from "express";
import multer from "multer";
import {
  createAuthor,
  createBook,
  createGenre,
  editBook,
  getAuthorList,
  getBookById,
  getBookCover,
  getBookList,
  getGenreList,
  updateBookCover,
} from "./books.controllers.js";
import { authenticate } from "middleware/authenticate.js";
import { checkRole } from "middleware/checkRole.js";
import { deleteBook } from "route/book/controller/deleteBook.js";

const router = Router();
const upload = multer({ dest: "./public/image/books" });

// public
router.get("/", getBookList);
router.get("/:id", getBookById);

router.get("/:id/cover", getBookCover);

router.get("/authors", getAuthorList);
router.get("/genres", getGenreList);

// admin privilege
router.use(authenticate);
router.use(checkRole("admin"));

router.post("/", createBook);
router.patch("/:id", editBook);
router.delete("/:id", deleteBook);

router.put("/:id/cover", updateBookCover);

router.post("/authors", createAuthor);
router.post("/genres", createGenre);

export default router;
