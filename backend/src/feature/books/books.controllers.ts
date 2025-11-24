import { createReadStream } from "fs";
import { cleanFile, normalizedToIntArray } from "../../util/request.js";
import * as services from "./books.services.js";
import * as models from "./books.models.js";
import * as Books from "./books.types.js";
import type { Controller } from "../../types/express.js";

// book data
export const getBookList: Books.GetBooksListCtrler = async function (
  req,
  res,
  next
) {
  const title = req.query.title;
  const genre = normalizedToIntArray(req.query.genre, true);
  const author = normalizedToIntArray(req.query.author, true);

  if ((title && typeof title != "string") || !genre.valid || !author.valid) {
    return res.status(400).send({ message: "Invalid query parameters" });
  }

  try {
    const books = await services.getBookSearch({
      title,
      genre: genre.value,
      author: author.value,
    });

    return res.status(200).send(books);
  } catch (error) {
    return next(error);
  }
};

export const getBookById: Books.GetBookByIdCtrler = async function (
  req,
  res,
  next
) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) {
    return res.status(400).send({ message: "Invalid book ID" });
  }

  try {
    const book = await services.getBookById(bookId);
    if (book == null) {
      return res.status(404).send({ message: "Book not found" });
    }

    return res.status(200).send(book);
  } catch (error) {
    return next(error);
  }
};

export const createBook: Books.CreateBookCtrler = async function (
  req,
  res,
  next
) {
  try {
    if (!req.body?.details) {
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
      let invalidFields: string[] = [];
      if (typeof title !== "string") invalidFields.push("title");
      if (!genres.valid) invalidFields.push("genres");
      if (!authors.valid) invalidFields.push("authors");

      return res
        .status(400)
        .send({ message: "Invalid book details: " + invalidFields.join(",") });
    }

    const createResult = await services.createBook(
      { title, genres: genres.value, authors: authors.value },
      req.file
    );

    if (!createResult.ok) {
      return res.status(400).send({ message: createResult.message });
    }
    res.status(201).send({ bookId: createResult.bookId });
  } catch (error) {
    return next(error);
  } finally {
    cleanFile(req.file);
  }
};
export const updateBook: Books.UpdateBookCtrler = async function (
  req,
  res,
  next
) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) {
    return res.status(400).send({ message: "Invalid book ID" });
  }

  const title = req.body.title;
  const genres = normalizedToIntArray(req.body.genres);
  const authors = normalizedToIntArray(req.body.authors);

  if (typeof title !== "string" || !genres.valid || !authors.valid) {
    let invalidFields: string[] = [];
    if (typeof title !== "string") invalidFields.push("title");
    if (!genres.valid) invalidFields.push("genres");
    if (!authors.valid) invalidFields.push("authors");

    return res
      .status(400)
      .send({ message: "Invalid book details: " + invalidFields.join(",") });
  }

  try {
    const updateResult = await services.updateBook(bookId, {
      title,
      genres: genres.value,
      authors: authors.value,
    });
    if (!updateResult.ok) {
      return res
        .status(updateResult.status)
        .send({ message: updateResult.message });
    }
  } catch (error) {
    return next(error);
  }

  return res.status(204).send();
};
export const deleteBook: Controller = async function (req, res, next) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) {
    return res.status(400).send({ message: "Invalid book ID" });
  }

  try {
    const deleteResult = await services.deleteBook(bookId);
    if (!deleteResult.ok) {
      return res.status(deleteResult.status).send(deleteResult.message);
    }

    res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

// cover
export const getBookCover: Controller = async function (req, res, next) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) {
    return res.status(400).send({ message: "Invalid book ID" });
  }

  let bookCoverImgData;
  try {
    bookCoverImgData = await services.getBookCoverData(bookId);
    if (bookCoverImgData == null) {
      return res.status(404).send({ message: "Image not found" });
    }
  } catch (error) {
    return next(error);
  }

  res.setHeader("Content-Type", bookCoverImgData?.mimeType);
  createReadStream(bookCoverImgData.path).pipe(res);
  return;
};
export const updateBookCover: Controller = async function (req, res, next) {
  try {
    const bookId = Number(req.params.id);
    if (!Number.isInteger(bookId)) {
      return res.status(400).send({ message: "Invalid book ID" });
    }

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).send({ message: "Invalid file type" });
    }

    try {
      await services.updateBookCover(bookId, req.file);
    } catch (error) {
      return next(error);
    }
    return res.status(204).send();
  } finally {
    cleanFile(req.file);
  }
};

//book property
export const getGenreList: Books.GetGenresCtrler = async function (
  req,
  res,
  next
) {
  const search = req.query.search;
  if (search != undefined && typeof search !== "string") {
    return res.status(400).send({ message: "Invalid search value" });
  }

  try {
    const genres = await models.getGenreList(search);
    return res.status(200).send(genres);
  } catch (error) {
    return next(error);
  }
};
export const getAuthorList: Books.GetAuthorsCtrler = async function (req, res) {
  const search = req.query.search;
  if (search != undefined && typeof search !== "string") {
    return res.status(400).send({ message: "Invalid search value" });
  }

  const authors = await models.getAuthorsList(search);
  return res.status(200).send(authors);
};

export const createGenre: Books.CreateGenreCtrler = async function (req, res) {
  const genre = req.body.genre;
  if (typeof genre !== "string") {
    return res.status(400).send({ message: "Invalid value" });
  }

  const createResult = await services.createGenre(genre);
  if (!createResult.ok) {
    return res.status(400).send({ message: createResult.message });
  }
  return res.status(200).send({ id: createResult.id, name: genre });
};

export const createAuthor: Books.CreateAuthorCtrler = async function (
  req,
  res
) {
  const author = req.body.author;
  if (typeof author !== "string") {
    return res.status(400).send({ message: "Invalid value" });
  }

  const createResult = await services.createAuthor(author);
  if (!createResult.ok) {
    return res.status(400).send({ message: createResult.message });
  }
  return res.status(200).send({ id: createResult.id, name: author });
};
