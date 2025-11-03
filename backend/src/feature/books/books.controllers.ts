import { createReadStream } from "fs";
import { Controller } from "types/express.js";
import * as services from "./books.services.js";
import * as models from "./books.models.js";
import {
  GetBooksList,
  GetBookById,
  CreateBookController,
  UpdateBook,
  GetAuthorsController,
  GetGenresontroller,
  CreateAuthorController,
  CreateGenreController,
} from "./books.types.js";
import { cleanFile } from "#util/files.js";

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
  try {
    const bookDetails = req.body?.details;

    if (bookDetails == undefined) {
      return res.status(400).send();
    }

    const { title, authors, genres } = JSON.parse(bookDetails);

    if (!title || !Array.isArray(authors) || !Array.isArray(genres)) {
      return res.status(400).send();
    }

    await services.createBook({ title, authors, genres }, req.file);
    res.status(204).send();
  } catch (err) {
    console.log(err);
  } finally {
    cleanFile(req.file);
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
  } finally {
    cleanFile(req.file);
  }
};
export const deleteBook: Controller = async function (req, res) {
  const bookId = Number(req.params.id);
  if (isNaN(bookId)) {
    return res.status(400).send();
  }

  try {
    await services.deleteBook(bookId);
    res.status(204).send();
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

  if (req.file && !req.file.mimetype.startsWith("image/")) {
    return res.status(400).send();
  }

  try {
    await services.updateBookCover(bookId, req.file);
    return res.status(200).send();
  } catch (err) {
    console.log(err);
  } finally {
    cleanFile(req.file);
  }
};

//book property
export const getGenreList: GetGenresontroller = async function (req, res) {
  const search = req.query.search;

  try {
    const genres = await models.getGenreList(search);
    return res.status(200).send(genres);
  } catch (err) {
    console.log(err);
  }
};
export const getAuthorList: GetAuthorsController = async function (req, res) {
  const search = req.query.search;

  try {
    const authors = await models.getAuthorsList(search);
    return res.status(200).send(authors);
  } catch (err) {
    console.log(err);
  }
};

export const createGenre: CreateGenreController = async function (req, res) {
  let genre = req.body.genre;
  if (genre == undefined) {
    return res.status(400).send();
  }

  try {
    const genreId = await services.createGenre(genre);
    return res.status(200).send({ id: genreId, name: genre });
  } catch (err) {
    console.log(err);
  }
};

export const createAuthor: CreateAuthorController = async function (req, res) {
  let author = req.body.author;
  if (author == undefined) {
    return res.status(400).send();
  }

  try {
    const authorId = await services.createAuthor(author);
    return res.status(200).send({ id: authorId, name: author });
  } catch (err) {
    console.log(err);
  }
};
