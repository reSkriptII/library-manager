import { readdir, copyFile, rm } from "fs/promises";
import path from "path";
import mime from "mime-types";
import * as models from "./books.models.js";

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

export async function createBook(
  details: models.BookDetail,
  file: Express.Multer.File | undefined
) {
  const genres = [...new Set(details.genres)];
  const authors = [...new Set(details.authors)];
  const [isGenreIdsExist, isAuthorIdsExist] = await Promise.all([
    models.isAuthorIdsExist(authors),
    models.isGenreIdsExist(genres),
  ]);

  if (!isGenreIdsExist || !isAuthorIdsExist) {
    return {
      success: false,
      message: `${!isGenreIdsExist ? "Genre" : "Author"} not exist`,
    };
  }
  try {
    const bookId = await models.createBook(details);

    if (file && file.mimetype.startsWith("image/")) {
      await updateBookCover(bookId, file);
    }
    return { success: true, bookId };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (String(err.code).startsWith("23")) {
        return { success: false, message: "Create book conflict" };
      }
    }

    throw err;
  }
}

export async function updateBook(id: number, options: models.BookDetail) {
  try {
    const isBookExist = await models.isBookExist(id);
    if (!isBookExist) {
      return { ok: false, status: 404, message: "Book not found" };
    }

    const isGenresExist = await models.isGenreIdsExist(options.genres);
    if (!isGenresExist) {
      return { ok: false, status: 400, message: "Invalid genre" };
    }

    const isAuthorsExist = await models.isAuthorIdsExist(options.authors);
    if (!isAuthorsExist) {
      return { ok: false, status: 400, message: "Invalid author" };
    }

    await models.updateBook(id, options);
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === "22P02") {
        return { ok: false, status: 400, message: "Invalid input type" };
      } else if (String(err.code).startsWith("23")) {
        return { ok: false, status: 400, message: "Conflict update" };
      }
    }

    throw err;
  }
}

export async function deleteBook(id: number) {
  try {
    const isBookExist = await models.isBookExist(id);
    if (!isBookExist) {
      throw Error("Book not exist");
    }

    await models.deleteBook(id);
  } catch (err) {
    throw err;
  }
}

export async function getBookCoverData(id: number | string) {
  try {
    const imgDir = await readdir(COVER_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name == String(id)
    );
    if (filteredImgNames.length === 0) {
      return null;
    }

    const coverImgPath = path.join(COVER_IMAGE_DIR_PATH, filteredImgNames[0]);
    const mimeType = mime.lookup(coverImgPath);

    if (!mimeType || !mimeType.startsWith("image/")) {
      return null;
    }
    return { mimeType, path: coverImgPath };
  } catch (err) {
    throw err;
  }
}

export async function updateBookCover(
  id: number | string,
  file?: Express.Multer.File | undefined
) {
  try {
    const imgDir = await readdir(COVER_IMAGE_DIR_PATH);

    const filteredImgNames = imgDir.filter(
      (file) => path.parse(file).name === id
    );
    filteredImgNames.forEach((img) => rm(path.join(COVER_IMAGE_DIR_PATH, img)));

    if (file != undefined) {
      const destFileName = id + "." + mime.extension(file.mimetype);
      const srcFilePath = path.resolve(file.path);
      const destFilePath = path.join(COVER_IMAGE_DIR_PATH, destFileName);

      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    throw err;
  }
}

export async function createGenre(genre: string) {
  try {
    const isGenreUsed = await models.isGenreNameExist(genre);
    if (isGenreUsed) {
      throw new Error("Genre is used");
    }

    return await models.createGenre(genre);
  } catch (err) {
    throw err;
  }
}

export async function createAuthor(author: string) {
  try {
    const isAuthorUsed = await models.isAuthorNameExist(author);
    if (isAuthorUsed) {
      throw new Error("Author is used");
    }

    return await models.createAuthor(author);
  } catch (err) {
    throw err;
  }
}
function structureBook(book: models.BookObject) {
  const genreId = book.genre_ids as number[];
  const genres: { id: number; name: string }[] = [];
  genreId.forEach((id, index) =>
    genres.push({ id, name: book.genre_names[index] })
  );

  const authorId = book.author_ids as number[];
  const authors: { id: number; name: string }[] = [];
  authorId.forEach((id, index) =>
    authors.push({ id, name: book.genre_names[index] })
  );
  return {
    id: book.id,
    title: book.title,
    genres,
    authors,
    lent: book.lent,
    reserveQueue: book.reserve_queue,
  };
}

const COVER_IMAGE_DIR_PATH = path.resolve("public", "image", "books");
