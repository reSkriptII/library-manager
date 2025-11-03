import { readdir, copyFile, rm } from "fs/promises";
import path from "path";
import mime from "mime-types";
import * as models from "./books.models.js";
import type { GetBooksList } from "./books.types.js";

type SearchParam = GetBooksList.ReqQuery;
export async function getBookSearch(search: SearchParam) {
  try {
    let books: any[];

    if (Object.keys(search).length > 0) {
      books = await models.searchBooks(search);
    } else {
      books = await models.getAllBooks();
    }

    const structuredBooks = books.map((book) => structureBook(book));

    return structuredBooks;
  } catch (err) {
    //TODO: handle db error
    throw err;
  }
}

export async function getBookById(id: number) {
  try {
    let book = (await models.searchBooks({ id }))?.[0];
    if (book == undefined) return null;
    return structureBook(book);
  } catch (err) {
    console.log(err);
  }
}

export async function createBook(
  detail: models.BookDetail,
  file: Express.Multer.File | undefined
) {
  const { authors, genres } = detail;
  try {
    const isGenresExist = await models.isAuthorsExist(authors);
    if (!isGenresExist) {
      throw Error("Genre not exist");
    }

    const isAuthorsExist = await models.isGenresExist(genres);
    if (!isAuthorsExist) {
      throw Error("Author not exist");
    }

    const bookId = await models.createBook(detail);

    if (file && file.mimetype.startsWith("image/")) {
      await updateBookCover(bookId, file);
    }
  } catch (err) {
    throw err;
  } finally {
    if (file)
      rm(path.join(process.cwd(), file.path)).catch((err) => console.log(err));
  }
}

export async function updateBook(id: number, options: models.BookDetail) {
  try {
    const isBookExist = models.isBookExist(id);
    if (!isBookExist) {
      throw new Error("Book not exist");
    }

    const isGenresExist = await models.isGenresExist(options.genres);
    if (!isGenresExist) {
      throw Error("Genre not exist");
    }

    const isAuthorsExist = await models.isAuthorsExist(options.authors);
    if (!isAuthorsExist) {
      throw Error("Author not exist");
    }

    await models.updateBook(id, options);
  } catch (err) {
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
  } finally {
    if (file) {
      rm(path.resolve(file.path));
    }
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
