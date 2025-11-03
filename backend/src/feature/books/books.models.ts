import { psqlPool } from "#util/db.js";
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

export async function getAllBooks(): Promise<BookObject[]> {
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
        ) b ON books.id = b.book_id;`
    )
    .then((r) => r.rows);
}

type SearchParam = {
  id?: number;
  title?: string;
  author?: number | number[];
  genre?: number | number[];
};

export async function searchBooks({
  id,
  title,
  author,
  genre,
}: SearchParam): Promise<BookObject[]> {
  if (author != undefined && !Array.isArray(author)) author = [author];
  if (genre != undefined && !Array.isArray(genre)) genre = [genre];

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
      [id, title, author ?? null, genre ?? null]
    )
    .then((r) => r.rows);
}

export type BookDetail = {
  title: string;
  genres: number[];
  authors: number[];
};
export async function createBook({ title, authors, genres }: BookDetail) {
  if (!title || !Array.isArray(authors) || !Array.isArray(genres))
    throw new TypeError("");

  const client = await psqlPool.connect();
  try {
    client.query("BEGIN");

    const bookId = await client
      .query("INSERT INTO books (title) VALUES ($1) RETURNING book_id", [title])
      .then((r) => r.rows[0].book_id);

    await client.query(
      `INSERT INTO book_authors (book_id, author_id) 
    SELECT $1, author_id FROM UNNEST($2::int[]) as author_id`,
      [bookId, authors]
    );
    await client.query(
      `INSERT INTO book_genres (book_id, genre_id) 
    SELECT $1, genre_id FROM UNNEST($2::int[]) as genre_id`,
      [bookId, genres]
    );

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
  const client = await psqlPool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE books SET title = $2 WHERE book_id = $1", [
      id,
      options.title,
    ]);

    await client.query("DELETE FROM book_genres WHERE book_id = $1", [id]);
    if (options.genres.length > 0) {
      await client.query(
        `INSERT INTO book_genres (book_id, genre_id) 
        SELECT $1, genre_id FROM UNNEST($2::int[]) AS genre_id`,
        [id, options.genres]
      );
    }

    await client.query("DELETE FROM book_authors WHERE book_id = $1", [id]);
    if (options.authors.length > 0) {
      await client.query(
        `INSERT INTO book_authors(book_id, author_id) 
        SELECT $1, genre_id FROM UNNEST($2::int[]) AS genre_id`,
        [id, options.authors]
      );
    }

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
export async function getGenreList() {
  return psqlPool
    .query("SELECT genre_id as id, genre_name as name FROM genres")
    .then((r) => r.rows as BookPropEntity[]);
}
export async function createGenre(genre: string) {
  return await psqlPool
    .query("INSERT INTO genres (genre_name) VALUES ($1) RETURNING genre_id", [
      genre,
    ])
    .then((r) => r.rows[0]);
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
export async function getAuthorsList() {
  return await psqlPool
    .query("SELECT author_id as id, author_name as name FROM authors")
    .then((r) => r.rows as BookPropEntity[]);
}
export async function createAuthor(author: string) {
  return await psqlPool
    .query(
      "INSERT INTO authors (author_name) VALUES ($1) RETURNING author_id",
      [author]
    )
    .then((r) => r.rows[0]);
}
