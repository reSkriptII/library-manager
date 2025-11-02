import * as services from "./books.services.js";
import { GetBooksList, GetBookById } from "./books.types.js";

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
export const getBookById = function () {};

export const createBook = function () {};
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
