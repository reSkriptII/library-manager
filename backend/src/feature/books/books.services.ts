import { copyFile, rm } from "fs/promises";
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
    if (!(await models.isAuthorsExist(authors))) {
      throw Error("Author not exist");
    }
    if (!(await models.isGenresExist(genres))) {
      throw Error("Genre not exist");
    }
    const bookId = await models.createBook(detail);

    if (file && file.mimetype.split("/")[0] === "image") {
      const cwd = process.cwd();
      const destFileName = bookId + "." + mime.extension(file.mimetype);
      const srcFilePath = path.join(cwd, file.path);
      const destFilePath = path.join(
        cwd,
        "public",
        "image",
        "books",
        destFileName
      );

      await copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    throw err;
  } finally {
    if (file)
      rm(path.join(process.cwd(), file.path)).catch((err) => console.log(err));
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
