import * as services from "./books.services.js";
import {
  GetBooksList,
  GetBookById,
  CreateBookController,
} from "./books.types.js";

// book data
export const getBookList: GetBooksList.Controller = async function (req, res) {
  try {
    const books = await services.getBookSearch(req.query);
    res.status(200).send(books);
    return;
  } catch (err) {
    console.log("/books getBookList: ", err);
  }
};
export const getBookById: GetBookById.Controller = async function (req, res) {
  const bookId = req.params.id;
  if (isNaN(bookId)) {
    res.status(400).send();
    return;
  }

  try {
    const book = await services.getBookById(bookId);
    if (book == null) {
      res.status(404).send();
      return;
    }

    res.status(200).send(book);
    return;
  } catch (err) {
    console.log(`/books/${req.params.id}`);
  }
};

export const createBook: CreateBookController = async function (req, res) {
  const bookDetail = req.body?.detail;
  if (bookDetail == undefined) {
    res.status(400).send();
    return;
  }

  const { title, authors, genres } = JSON.parse(bookDetail);

  if (!title || !Array.isArray(authors) || !Array.isArray(genres)) {
    res.status(400).send();
    return;
  }

  try {
    await services.createBook({ title, authors, genres }, req.file);
    res.status(204).send();
  } catch (err) {
    console.log(err);
  }
};
export const editBook = function () {};
export const deleteBook = function () {};

// cover
export const getBookCover = function () {};
export const updateBookCover = function () {};
export const deleteBookCover = function () {};

//book property
export const getAuthorList = function () {};
export const getGenreList = function () {};

export const createAuthor = function () {};
export const createGenre = function () {};
