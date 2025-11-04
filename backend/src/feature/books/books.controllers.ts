import { createReadStream } from "fs";
import { Controller } from "types/express.js";
import * as services from "./books.services.js";
import * as models from "./books.models.js";
import * as Books from "./books.types.js";
import { cleanFile } from "#util/files.js";
import { normalizedToIntArray } from "#util/request.js";

// book data
export const getBookList: Books.GetBooksListCtrler = async function (req, res) {
  const title = req.query.title;
  const genre = normalizedToIntArray(req.query.genre, true);
  const author = normalizedToIntArray(req.query.author, true);

  if ((title && typeof title != "string") || !genre.valid || !author.valid) {
    return res.status(400).send({ message: "Invalid query parameters" });
  }

  const books = await services.getBookSearch({
    title,
    genre: genre.value,
    author: author.value,
  });

  return res.status(200).send(books);
};

export const getBookById: Books.GetBookByIdCtrler = async function (req, res) {
  const bookId = req.params.id;
  if (!Number.isInteger(bookId)) {
    return res.status(400).send({ message: "Invalid book ID" });
  }

  const book = await services.getBookById(bookId);
  if (book == null) {
    return res.status(404).send({ message: "Book not found" });
  }

  return res.status(200).send(book);
};

export const createBook: Books.CreateBookCtrler = async function (req, res) {
  try {
    if (req.body?.details) {
      return res.status(400).send({ message: "Invalid book details" });
    }

    let bookDetails;
    try {
      bookDetails = JSON.parse(req.body?.details);
    } catch {
      return res.status(400).send({ message: "Invalid book details" });
    }

    const title = bookDetails.title;
    const genres = normalizedToIntArray(bookDetails.genres);
    const authors = normalizedToIntArray(bookDetails.authors);

    if (typeof title !== "string" || !genres.valid || !authors.valid) {
      return res.status(400).send({ message: "Invalid book details" });
    }

    const bookId = await services.createBook(
      { title, genres: genres.value, authors: authors.value },
      req.file
    );
    res.status(201).send({ id: bookId });
  } finally {
    cleanFile(req.file);
  }
};
export const updateBook: Books.UpdateBookCtrler = async function (req, res) {
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
export const getGenreList: Books.GetGenresCtrler = async function (req, res) {
  const search = req.query.search;

  try {
    const genres = await models.getGenreList(search);
    return res.status(200).send(genres);
  } catch (err) {
    console.log(err);
  }
};
export const getAuthorList: Books.GetAuthorsCtrler = async function (req, res) {
  const search = req.query.search;

  try {
    const authors = await models.getAuthorsList(search);
    return res.status(200).send(authors);
  } catch (err) {
    console.log(err);
  }
};

export const createGenre: Books.CreateGenreCtrler = async function (req, res) {
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

export const createAuthor: Books.CreateAuthorCtrler = async function (
  req,
  res
) {
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
