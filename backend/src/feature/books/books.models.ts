import { psqlPool } from "#src/util/db.js";
import { BookPropEntity } from "./books.types.js";

export type BookObject = {
  id: number;
  title: string;
  author_ids: number[];
  author_names: string[];
  genre_ids: number[];
  genre_names: string[];
  lent: boolean;
  reserve_queue: number;
};

export type SearchParam = {
  id?: number | null;
  title?: string | null;
  author?: number[] | null;
  genre?: number[] | null;
};

export async function searchBooks(search: SearchParam): Promise<BookObject[]> {
  const { id = null, title = null } = search;
  const genre = search.genre ? [...new Set(search.genre)] : null;
  const author = search.author ? [...new Set(search.author)] : null;
  console.log(search);

  return psqlPool
    .query(
      `SELECT id, title, author_ids, author_names, genre_ids, genre_names,
        a.book_id IS NOT NULL as lent,
        COALESCE(b.reserve_queue, 0) as reserve_queue
      FROM book_details books
      LEFT JOIN (
        SELECT DISTINCT book_id
        FROM lends 
        WHERE return_time IS NULL
        GROUP BY book_id  
      ) a ON books.id = a.book_id
      LEFT JOIN 
        (SELECT book_id, count(*) as reserve_queue
        FROM reservations 
        GROUP BY book_id
        ) b ON books.id = b.book_id
      WHERE ($1::int IS NULL OR id = $1)
        AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
        AND ($3::int[] IS NULL OR id IN 
          (SELECT book_id FROM book_authors WHERE author_id = ANY($3)))
        AND ($4::int[] IS NULL OR id IN
          (SELECT book_id FROM book_genres WHERE genre_id = ANY($4)))`,
      [id, title, author, genre]
    )
    .then((r) => r.rows);
}

export type BookDetail = {
  title: string;
  genres: number[];
  authors: number[];
};
export async function createBook(details: BookDetail) {
  const title = details.title;
  const genres = [...new Set(details.genres)];
  const authors = [...new Set(details.authors)];
  const client = await psqlPool.connect();
  try {
    client.query("BEGIN");

    const bookId = await client
      .query("INSERT INTO books (title) VALUES ($1) RETURNING book_id", [title])
      .then((r) => r.rows[0].book_id);

    await Promise.all([
      genres.length &&
        client.query(
          `INSERT INTO book_genres (book_id, genre_id) 
           SELECT $1, genre_id FROM UNNEST($2::int[]) as genre_id`,
          [bookId, genres]
        ),
      authors.length &&
        client.query(
          `INSERT INTO book_authors (book_id, author_id) 
           SELECT $1, author_id FROM UNNEST($2::int[]) as author_id`,
          [bookId, authors]
        ),
    ]);

    client.query("COMMIT");
    return bookId;
  } catch (err) {
    client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateBook(id: number, options: BookDetail) {
  const genres = [...new Set(options.genres)];
  const authors = [...new Set(options.authors)];

  const client = await psqlPool.connect();
  try {
    await client.query("BEGIN");

    await Promise.all([
      client.query("DELETE FROM book_genres WHERE book_id = $1", [id]),
      client.query("DELETE FROM book_authors WHERE book_id = $1", [id]),
    ]);

    await Promise.all([
      client.query("UPDATE books SET title = $2 WHERE book_id = $1", [
        id,
        options.title,
      ]),
      genres.length &&
        client.query(
          `INSERT INTO book_genres (book_id, genre_id) 
          SELECT $1, genre_id FROM UNNEST($2::int[]) AS genre_id`,
          [id, genres]
        ),
      authors.length &&
        client.query(
          `INSERT INTO book_authors(book_id, author_id) 
          SELECT $1, genre_id FROM UNNEST($2::int[]) AS genre_id`,
          [id, authors]
        ),
    ]);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteBook(id: number) {
  await psqlPool.query("DELETE FROM books WHERE book_id = $1", [id]);
}

export async function isBookExist(id: number) {
  return psqlPool
    .query("SELECT 1 FROM books WHERE book_id = $1", [id])
    .then((r) => r.rows.length > 0);
}
export async function isBookAvailable(id: number) {
  return psqlPool
    .query(
      `SELECT 1 FROM reservations WHERE book_id = $1
      UNION
      SELECT 1 FROM lends WHERE return_time = null ANd book_id = $1`,
      [id]
    )
    .then((r) => r.rows.length != 0);
}

export async function isGenreIdsExist(ids: number[]) {
  return psqlPool
    .query("SELECT 1 FROM genres WHERE genre_id = ANY($1::int[])", [ids])
    .then((r) => r.rows.length == ids?.length);
}
export async function isGenreNameExist(genre: string) {
  return psqlPool
    .query("SELECT 1 FROM genres WHERE genre_name = $1", [genre])
    .then((r) => r.rows.length > 0);
}
export async function getGenreList(search?: string) {
  return psqlPool
    .query(
      "SELECT genre_id as id, genre_name as name FROM genres WHERE genre_name ILIKE '%'|| $1 || '%'",
      [search ?? ""]
    )
    .then((r) => r.rows as BookPropEntity[]);
}
export async function createGenre(genre: string) {
  return await psqlPool
    .query(
      "INSERT INTO genres (genre_name) VALUES ($1) RETURNING genre_id as id",
      [genre]
    )
    .then((r) => r.rows[0].id as number);
}

export async function isAuthorIdsExist(ids: number[]) {
  return await psqlPool
    .query("SELECT 1 FROM authors WHERE author_id = ANY($1::int[])", [ids])
    .then((r) => Boolean(r.rows.length == ids?.length));
}
export async function isAuthorNameExist(author: string) {
  return psqlPool
    .query("SELECT 1 FROM authors WHERE author_name = $1", [author])
    .then((r) => r.rows.length > 0);
}
export async function getAuthorsList(search?: string) {
  return await psqlPool
    .query(
      "SELECT author_id as id, author_name as name FROM authors WHERE author_name ILIKE '%'|| $1 || '%'",
      [search ?? ""]
    )
    .then((r) => r.rows as BookPropEntity[]);
}
export async function createAuthor(author: string) {
  return await psqlPool
    .query(
      "INSERT INTO authors (author_name) VALUES ($1) RETURNING author_id as id",
      [author]
    )
    .then((r) => r.rows[0].id as number);
}
