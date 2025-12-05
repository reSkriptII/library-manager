import { readdir, copyFile, rm } from "fs/promises";
import path from "path";
import mime from "mime-types";
import { ENV } from "../../config/env.js";
import { FileError } from "../../util/error.js";
import * as models from "./books.models.js";
import * as bookModels from "../../models/books.js";

export async function getBookSearch(search: models.SearchParam) {
  let books = await models.searchBooks(search);

  const structuredBooks = books.map((book) => structureBook(book));
  return structuredBooks;
}

export async function getBookById(id: number) {
  const book = (await models.searchBooks({ id }))?.[0];
  if (book == undefined) return null;
  return structureBook(book);
}

type CreateBookResult =
  | { ok: false; message: string }
  | { ok: true; bookId: number };

export async function createBook(
  details: models.BookDetail,
  file: Express.Multer.File | undefined
): Promise<CreateBookResult> {
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
  try {
    const bookId = await models.createBook(details);

    if (file && file.mimetype.startsWith("image/")) {
      await updateBookCover(bookId, file);
    }
    return { ok: true, bookId };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
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

export async function updateBook(
  id: number,
  options: models.BookDetail
): Promise<UpdateBookResult> {
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
  try {
    await models.updateBook(id, options);
    return { ok: true };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (String(err.code).startsWith("23")) {
        return { ok: false, status: 400, message: "Conflict update" };
      }
    }
    throw err;
  }
}

type DeleteBookResult = UpdateBookResult;
export async function deleteBook(id: number): Promise<DeleteBookResult> {
  const isBookExist = await bookModels.isBookExist(id);
  if (!isBookExist) {
    return { ok: false, status: 404, message: "Book not found" };
  }

  const isBookAvailable = await bookModels.isBookAvailable(id);
  if (!isBookAvailable) {
    return { ok: false, status: 400, message: "Book is being used" };
  }

  try {
    await models.deleteBook(id);
    return { ok: true };
  } catch (err) {
    console.log(err);
    if (err instanceof Error && "code" in err) {
      if (String(err.code).startsWith("23")) {
        return { ok: false, status: 400, message: "Book is being used" };
      }
    }
    throw err;
  }
}

export async function getBookCoverData(id: number | string) {
  try {
    const imgDir = await readdir(ENV().COVER_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name == String(id)
    );
    if (filteredImgNames.length === 0) {
      return null;
    }

    const coverImgPath = path.join(
      ENV().COVER_IMAGE_DIR_PATH,
      filteredImgNames[0]
    );
    const mimeType = mime.lookup(coverImgPath);

    if (!mimeType || !mimeType.startsWith("image/")) {
      return null;
    }
    return { mimeType, path: coverImgPath };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
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

export async function updateBookCover(
  id: number | string,
  file?: Express.Multer.File | undefined
) {
  try {
    const imgDir = await readdir(ENV().COVER_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === String(id)
    );

    filteredImgNames.forEach((img) =>
      rm(path.join(ENV().COVER_IMAGE_DIR_PATH, img))
    );

    if (file != undefined) {
      const destFileName = id + "." + mime.extension(file.mimetype);
      const srcFilePath = path.resolve(file.path);
      const destFilePath = path.join(ENV().COVER_IMAGE_DIR_PATH, destFileName);
      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    if (err instanceof Error && "code" in err) {
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

type CreatePropResult =
  | { ok: false; message: string }
  | { ok: true; id: number };

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
      if (err.code == "23505") {
        return { ok: false, message: "Genre name is used" };
      }
    }
    throw err;
  }
}

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
      if (err.code == "23505") {
        return { ok: false, message: "Author name is used" };
      }
    }
    throw err;
  }
}
function structureBook(book: models.BookObject) {
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
