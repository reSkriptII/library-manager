import { createReadStream } from "fs";
import { cleanFile, normalizedToIntArray } from "../../util/request.js";
import * as services from "./books.services.js";
import * as models from "./books.models.js";
import * as Books from "./books.types.js";
import type { Controller } from "../../types/express.js";

// --------------- get book data ---------------

/** Send an array of book data filtered by query params
 *
 * @param {string} req.query.title - filter by book title
 * @param {string | string[]} req.query.genre - filter by genre(s) id. intenally convert to int[]
 * @param {string | string[]} req.query.author - filter by author(s) id. intenally convert to int[]
 */
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

/** Send a book data by id in url param
 *
 * @param {string} req.param.id - book id, convert to int
 */
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

// --------------- book details operation ---------------

/** create book with details in req.body.details JSON and cover image in req.body.coverImage
 *
 * @param {object} req.body - multipart/form-data format
 * @param {string} req.body.details - a JSON string of book data.
 * @param req.body.coverImage - an optional field for cover image.
 *
 * @param req.body.details.title - book title
 * @param req.body.details.genres - genre(s) id. internally convert to int[]
 * @param req.body.details.authors - author(s) id. internally convert to int[]
 * @param {Express.Multer.File} req.file - a cover image parse from req.body.coverImage
 */
export const createBook: Books.CreateBookCtrler = async function (
  req,
  res,
  next
) {
  try {
    if (!req.body?.details) {
      return res.status(400).send({ message: "Invalid book details" });
    }

    // --- parse JSON and validate book details ---

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
      // generate error field details for error message
      let invalidFields: string[] = [];
      if (typeof title !== "string") invalidFields.push("title");
      if (!genres.valid) invalidFields.push("genres");
      if (!authors.valid) invalidFields.push("authors");

      return res
        .status(400)
        .send({ message: "Invalid book details: " + invalidFields.join(",") });
    }

    // --- create a book and send response ---

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
    // garanteer deletion temporary file from request
    cleanFile(req.file);
  }
};

/** Replace book data at /:id with data in req.body
 *
 * @param {string} req.param.id - book id
 * @param {string} req.body.title - book title
 * @param {string | string[]} req.body.genres - genre(s) id. internally convert to int[]
 * @param {string | string[]} req.body.authors - author(s) id. internally convert to int[]
 */
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
    // generate error field details for error message
    let invalidFields: string[] = [];
    if (typeof title !== "string") invalidFields.push("title");
    if (!genres.valid) invalidFields.push("genres");
    if (!authors.valid) invalidFields.push("authors");

    return res
      .status(400)
      .send({ message: "Invalid book details: " + invalidFields.join(",") });
  }

  // --- update a book and send response ---

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

/** delete book data at /:id
 *
 * @param {string} req.param.id - book id
 */
export const deleteBook: Controller = async function (req, res, next) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId)) {
    return res.status(400).send({ message: "Invalid book ID" });
  }

  try {
    const deleteResult = await services.deleteBook(bookId);
    if (!deleteResult.ok) {
      return res
        .status(deleteResult.status)
        .send({ message: deleteResult.message });
    }

    res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

// --------------- cover image operation ---------------

/** send cover image of book /:id with content-type: image/*
 *
 * @param {string} req.param.id - book id
 */
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

  res.setHeader("Content-Type", bookCoverImgData.mimeType);
  // stream image file content directly to response object and end response lifecycle
  // use node.js stream for efficiency and avoid loading entire file into memory
  createReadStream(bookCoverImgData.path).pipe(res);
  return;
};

/** replace book cover image of book /:id
 *
 * check field 'coverImage' for content-type: image/*
 *
 * delete cover image of book id if no file founded
 *
 * @param {number | null} req.param.id - book id
 * @param {Express.Multer.File} req.file - a cover image file parsed by multer
 */
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

// --------------- book property operation ---------------

/** send an array of genres in format { id: int, name: string } */
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

/** send an array of genres in format { id: int, name: string } */
export const getAuthorList: Books.GetAuthorsCtrler = async function (req, res) {
  const search = req.query.search;
  if (search != undefined && typeof search !== "string") {
    return res.status(400).send({ message: "Invalid search value" });
  }

  const authors = await models.getAuthorsList(search);
  return res.status(200).send(authors);
};

/** create a new genre
 *
 * @param {string} req.body.genre - a name of new genre
 */
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

/** create a new author
 *
 * @param {string} req.body.genre - a name of new author
 */
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
