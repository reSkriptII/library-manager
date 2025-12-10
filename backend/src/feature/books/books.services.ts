import { readdir, copyFile, rm } from "fs/promises";
import path from "path";
import mime from "mime-types";
import { ENV } from "../../config/env.js";
import { FileError } from "../../util/error.js";
import * as models from "./books.models.js";
import * as bookModels from "../../models/books.js";

// --------------- get book data ---------------

/** Query an array of books data filtered by search
 *
 * each search field is ignore if null or undefinded
 * @param {number} search.id -
 * @param {string} search.title
 * @param {number[]} search.genre
 * @param {number[]} search.author
 * @returns {BookData[]} an array of books that meet filter requirement.
 * empty array if no book matched
 */
export async function getBookSearch(search: models.SearchParam) {
  let books = await models.searchBooks(search);

  const structuredBooks = books.map((book) => structureBook(book));
  return structuredBooks;
}

/**
 * @param {number} id - an unique book id to search
 * @returns {BookData} a book with specific id
 */
export async function getBookById(id: number) {
  const book = (await models.searchBooks({ id }))?.[0];
  if (book == undefined) return null;
  return structureBook(book);
}

// --------------- modify book data ---------------

type CreateBookResult =
  | { ok: false; message: string }
  | { ok: true; bookId: number };

/**
 * @param {string} details.title - book title string
 * @param {number[]} details.genres - an array of genres id
 * @param {number[]} details.authors - an array of authors id
 * @returns {CreateBookResult} an object status flag 'ok: boolean' and created book id or error message
 */
export async function createBook(
  details: models.BookDetail,
  file: Express.Multer.File | undefined
): Promise<CreateBookResult> {
  // remove duplication
  const genres = [...new Set(details.genres)];
  const authors = [...new Set(details.authors)];

  const [isGenreIdsExist, isAuthorIdsExist] = await Promise.all([
    models.isAuthorIdsExist(authors),
    models.isGenreIdsExist(genres),
  ]);

  if (!isGenreIdsExist || !isAuthorIdsExist) {
    return {
      ok: false,
      message: `${!isGenreIdsExist ? "Genre" : "Author"} not exist`,
    };
  }

  // --- execute book creation ---

  try {
    const bookId = await models.createBook(details);

    if (file && file.mimetype.startsWith("image/")) {
      await updateBookCover(bookId, file);
    }
    return { ok: true, bookId };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // posgreSQL error: Class 23 — Integrity Constraint Violation - code 23xxx
      if (String(err.code).startsWith("23")) {
        return { ok: false, message: "Error creating book" };
      }
    }
    throw err;
  }
}

type UpdateBookResult =
  | { ok: false; status: number; message: string }
  | { ok: true };

/**
 * @param {number} id - an unique book id to update
 * @returns {CreateBookResult} an object with status flag 'ok: boolean', http status for response,
 * and created book id or error message
 */
export async function updateBook(
  id: number,
  options: models.BookDetail
): Promise<UpdateBookResult> {
  // remove duplication
  const genres = [...new Set(options.genres)];
  const authors = [...new Set(options.authors)];

  const [isBookExist, isGenresExist, isAuthorsExist] = await Promise.all([
    bookModels.isBookExist(id),
    models.isGenreIdsExist(genres),
    models.isAuthorIdsExist(authors),
  ]);

  if (!isBookExist) {
    return { ok: false, status: 404, message: "Book not found" };
  }

  if (!isGenresExist || !isAuthorsExist) {
    return {
      ok: false,
      status: 400,
      message: `${!isGenresExist ? "Genre" : "Author"} not exist`,
    };
  }

  // --- execute update ---

  try {
    await models.updateBook(id, options);
    return { ok: true };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // posgreSQL error: Class 23 — Integrity Constraint Violation - code 23xxx
      if (String(err.code).startsWith("23")) {
        return { ok: false, status: 400, message: "Conflict update" };
      }
    }
    throw err;
  }
}

type DeleteBookResult = UpdateBookResult;

/**
 * @param {number} id - an unique book id to delete
 * @returns {CreateBookResult} an object with status flag 'ok: boolean', http status for response,
 * and created book id or error message
 */
export async function deleteBook(id: number): Promise<DeleteBookResult> {
  const [isBookExist, isBookAvailable] = await Promise.all([
    bookModels.isBookExist(id),
    bookModels.isBookAvailable(id),
  ]);

  if (!isBookExist) {
    return { ok: false, status: 404, message: "Book not found" };
  }
  if (!isBookAvailable) {
    return { ok: false, status: 400, message: "Book is being used" };
  }

  // --- execute deletion ---

  try {
    await models.deleteBook(id);
    return { ok: true };
  } catch (err) {
    console.log(err);
    if (err instanceof Error && "code" in err) {
      // posgreSQL error: Class 23 — Integrity Constraint Violation - code 23xxx
      if (String(err.code).startsWith("23")) {
        return { ok: false, status: 400, message: "Book is being used" };
      }
    }
    throw err;
  }
}

// --------------- cover image operation ---------------

/** find a book cover image path from local file system storage with book id as a name
 * and check file type to be an image
 *
 * @param {number} id - an unique book id for the image
 * @returns {object | null} an object with mimeType and path to image file
 * or null if file not found
 *
 * throw FileError when directory not found or file access permission denied
 */
export async function getBookCoverData(id: number | string) {
  try {
    const imgDir = await readdir(ENV().COVER_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name == String(id)
    );
    if (filteredImgNames.length === 0) {
      return null;
    }

    // join for absolute path
    const coverImgPath = path.join(
      ENV().COVER_IMAGE_DIR_PATH,
      filteredImgNames[0]
    );

    // ensure that the file is an image
    const mimeType = mime.lookup(coverImgPath);
    if (!mimeType || !mimeType.startsWith("image/")) {
      return null;
    }
    return { mimeType, path: coverImgPath };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // directory not found or access error
      if (err.code === "ENOENT" || err.code === "EACCES") {
        throw new FileError(
          err.code,
          ENV().COVER_IMAGE_DIR_PATH,
          "GET /books/:id/cover"
        );
      }
    }
    throw err;
  }
}

/** Update book cover image in local file system storage with book id as a name
 *
 * @param {number} id - an unique book id to update
 * @param {Express.Multer.File} file - multer parsed file object to update into.
 * delete existing cover image of book id if undefined
 */
export async function updateBookCover(
  id: number | string,
  file?: Express.Multer.File | undefined
) {
  try {
    const imgDir = await readdir(ENV().COVER_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === String(id)
    );

    // delete all exised image
    // avoid duplication image for a book with different file extension
    filteredImgNames.forEach((img) =>
      rm(path.join(ENV().COVER_IMAGE_DIR_PATH, img))
    );

    // write a file to storage
    if (file != undefined) {
      const destFileName = id + "." + mime.extension(file.mimetype);
      const srcFilePath = path.resolve(file.path);
      const destFilePath = path.join(ENV().COVER_IMAGE_DIR_PATH, destFileName);
      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // directory not found or access error
      if (err.code === "ENOENT" || err.code === "EACCES") {
        throw new FileError(
          err.code,
          ENV().COVER_IMAGE_DIR_PATH,
          "GET /books/:id/cover"
        );
      }
    }
    throw err;
  }
}

// --------------- book genre and author ---------------

type CreatePropResult =
  | { ok: false; message: string }
  | { ok: true; id: number };

/** Check genre name for duplication and create new author
 *
 * @param {string} genre - genre name to be created
 * @returns {object} an object with status flag 'ok: boolean' and created genre id or an error message
 */
export async function createGenre(genre: string): Promise<CreatePropResult> {
  const isGenreUsed = await models.isGenreNameExist(genre);
  if (isGenreUsed) {
    return { ok: false, message: "Genre name is used" };
  }

  try {
    const genreId = await models.createGenre(genre);
    return { ok: true, id: genreId };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // posgreSQL error: Class 23 — Integrity Constraint Violation - code 23xxx
      if (err.code == "23505") {
        return { ok: false, message: "Genre name is used" };
      }
    }
    throw err;
  }
}

/** Check author name for duplication and create new author
 *
 * @param {string} author - author name to be created
 * @returns {object} an object with status flag 'ok: boolean' and created author id or error message
 */
export async function createAuthor(author: string): Promise<CreatePropResult> {
  const isAuthorUsed = await models.isAuthorNameExist(author);
  if (isAuthorUsed) {
    return { ok: false, message: "Author name is used" };
  }

  try {
    const authorId = await models.createAuthor(author);
    return { ok: true, id: authorId };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      // posgreSQL error: Class 23 — Integrity Constraint Violation - code 23xxx
      if (err.code == "23505") {
        return { ok: false, message: "Author name is used" };
      }
    }
    throw err;
  }
}

// --------------- helper function ---------------

/** structure book object from database into response format
 *
 * @param {models.BookObject} book - a book detail object queried from database
 * @return {object} a structured book object
 */
function structureBook(book: models.BookObject) {
  //join genre/author id with name to create an object with {id, name}
  const genreId = book.genre_ids as number[];
  const genres: { id: number; name: string }[] = [];
  genreId?.forEach(
    (id, index) =>
      book.genre_names && genres.push({ id, name: book.genre_names[index] })
  );

  const authorId = book.author_ids as number[];
  const authors: { id: number; name: string }[] = [];
  authorId?.forEach(
    (id, index) =>
      book.author_names && authors.push({ id, name: book.author_names[index] })
  );

  return {
    id: book.id,
    title: book.title,
    genres,
    authors,
    lent: book.lent,
    reserveQueue: Number(book.reserve_queue),
  };
}
