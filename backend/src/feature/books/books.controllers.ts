import { createReadStream } from "fs";
import { Controller } from "types/express.js";
import * as services from "./books.services.js";
import {
  GetBooksList,
  GetBookById,
  CreateBookController,
  UpdateBook,
  DeleteBookController,
} from "./books.types.js";

// book data
export const getBookList: GetBooksList.Controller = async function (req, res) {
  try {
    const books = await services.getBookSearch(req.query);
    return res.status(200).send(books);
  } catch (err) {
    console.log("/books getBookList: ", err);
  }
};
export const getBookById: GetBookById.Controller = async function (req, res) {
  const bookId = req.params.id;
  if (isNaN(bookId)) {
    return res.status(400).send();
  }

  try {
    const book = await services.getBookById(bookId);
    if (book == null) {
      return res.status(404).send();
    }

    return res.status(200).send(book);
  } catch (err) {
    console.log(`/books/${req.params.id}`);
  }
};

export const createBook: CreateBookController = async function (req, res) {
  const bookDetail = req.body?.detail;

  if (bookDetail == undefined) {
    return res.status(400).send();
  }

  try {
    const { title, authors, genres } = JSON.parse(bookDetail);

    if (!title || !Array.isArray(authors) || !Array.isArray(genres)) {
      return res.status(400).send();
    }

    await services.createBook({ title, authors, genres }, req.file);
    res.status(204).send();
  } catch (err) {
    console.log(err);
  }
};
export const updateBook: UpdateBook.Controller = async function (req, res) {
  const bookId = req.params.id;
  const { title, genres, authors } = req.body ?? {};

  if (bookId == undefined) return res.status(400).send();
  if (title == undefined || !Array.isArray(genres) || !Array.isArray(authors)) {
    return res.status(400).send();
  }

  try {
    await services.updateBook(bookId, { title, genres, authors });
    return res.status(204).send();
  } catch (err) {
    console.log(err);
  }
};
export const deleteBook: DeleteBookController = async function (req, res) {
  const bookId = req.params.id;
  if (isNaN(bookId)) {
    return res.status(400).send();
  }

  try {
    await services.deleteBook(bookId);
  } catch (err) {
    console.log(err);
  }
};

// cover
export const getBookCover: Controller = async function (req, res) {
  const bookId = req.params.id;
  if (isNaN(Number(bookId))) {
    return res.status(400).send();
  }

  try {
    const bookCoverImgData = await services.getBookCoverData(bookId);
    if (bookCoverImgData == null) {
      return res.status(404).send();
    }

    res.setHeader("Content-Type", bookCoverImgData?.mimeType);
    createReadStream(bookCoverImgData.path).pipe(res);
    return;
  } catch (err) {
    console.log(err);
  }
};
export const updateBookCover: Controller = async function (req, res) {
  const bookId = req.params.id;
  if (isNaN(Number(bookId))) {
    return res.status(400).send();
  }

  if (req.file == undefined || !req.file.mimetype.startsWith("image/")) {
    return res.status(400).send();
  }

  try {
    await services.updateBookCover(bookId, req.file);
    return res.status(200).send();
  } catch (err) {
    console.log(err);
  }
};

export const deleteBookCover: Controller = async function (req, res) {
  const bookId = req.params.id;
  if (isNaN(Number(bookId))) {
    return res.status(400).send();
  }

  try {
    await services.updateBookCover(bookId, undefined);
    return res.status(200).send();
  } catch (err) {
    console.log(err);
  }
};

//book property
export const getAuthorList = function () {};
export const getGenreList = function () {};

export const createAuthor = function () {};
export const createGenre = function () {};
