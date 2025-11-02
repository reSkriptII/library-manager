import * as models from "./books.models.js";
import type { BookSearchParam } from "./books.types.js";

export async function getBookSearch(search: BookSearchParam) {
  try {
    let books: any[];

    if (Object.keys(search).length > 0) {
      books = await models.searchBooks(search);
    } else {
      books = await models.getAllBooks();
    }

    const structuredBooks = books.map((book) => {
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
    });

    return structuredBooks;
  } catch (err) {
    //TODO: handle db error
    throw err;
  }
}
