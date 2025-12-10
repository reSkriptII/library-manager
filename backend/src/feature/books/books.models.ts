import { psqlPool } from "../../util/db.js";
import { BookPropEntity, BookObject } from "./books.types.js";

export { isBookExist, isBookAvailable } from "../../models/books.js";
export type { BookObject };

export type SearchParam = {
  id?: number | null;
  title?: string | null;
  author?: number[] | null;
  genre?: number[] | null;
};

/** get book details from database filtered with search constraint in WHERE clause
 *
 * ignore each search field when is null or undefined
 *
 * @param search.id - unique book_id. database constrant: must be an integer
 * @param search.title - books.title
 * @param search.genre - book genres id. must be an array of integer
 * @param search.author - book authors id. must be an array of integer
 * @return an array of book details from database
 */
export function searchBooks(search: SearchParam): Promise<BookObject[]> {
  // default search field absent to null
  const { id = null, title = null } = search;
  const genre = search.genre ? [...new Set(search.genre)] : null;
  const author = search.author ? [...new Set(search.author)] : null;

  /* SELECT a list of books with aggregated details and a calculated flag
   * ignore absent search filed (null)
   *
   * Derived fields:
   * - lent: A boolean flag indicating if the book has any active loans.
   * - reserve_queue: The count of active reservations for the book.
   *
   * The results are ORDER BY exact title matches, partial title matches,
   * and alphabetical title order.
   */
  return psqlPool
    .query(
      `SELECT id, title, author_ids, author_names, genre_ids, genre_names,
        a.book_id IS NOT NULL as lent,
        COALESCE(b.reserve_queue, 0) as reserve_queue
      FROM book_details books
      LEFT JOIN (
        SELECT DISTINCT book_id
        FROM loans
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
          (SELECT book_id FROM book_genres WHERE genre_id = ANY($4)))
      ORDER BY 
        ($2 IS NULL OR title = $2::text) DESC,
        ($2 IS NULL OR title ILIKE $2::text || '%') DESC,
        title ASC, 
        id ASC`,
      [id, title, author, genre]
    )
    .then((r) => r.rows);
}

export type BookDetail = {
  title: string;
  genres: number[];
  authors: number[];
};

/** create a book using a transaction and refresh book_details view
 *
 * insert title into books table,
 * insert genres into book_genres and authors into book_authors tables
 *
 * genres and authors must be array of integer for genre/author id
 *
 * @param {string} details.title - books.title
 * @param {number[]} details.genres - genre_id. many to many relationship with book
 * @param details.authors - genre_id. many to many relationship with book
 * @returns {number} created book id
 */
export async function createBook(details: BookDetail) {
  const title = details.title;
  const genres = [...new Set(details.genres)];
  const authors = [...new Set(details.authors)];
  const client = await psqlPool.connect();
  try {
    client.query("BEGIN");

    // INSERT book title and return book_id for book genres/authors insertion
    const bookId = await client
      .query("INSERT INTO books (title) VALUES ($1) RETURNING book_id", [title])
      .then((r) => r.rows[0].book_id);

    // insert book genres and authors
    // use Promise.all to send query and await in parallel, not waiting one to response first
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

    await client.query("COMMIT");
    client.query("REFRESH MATERIALIZED VIEW book_details");
    return bookId;
  } catch (err) {
    client.query("ROLLBACK");
    throw err;
  } finally {
    // close connection and free resource after transaction
    client.release();
  }
}

/** update a book using a transaction and refresh book_details view
 *
 * update title in books table,
 * clear book_genres and book_author for book id, then insert new genres and authors
 *
 * genres and authors must be array of integer for genre/author id
 *
 * @param {number} id - unique book_id. database constrain: must be an integer
 * @param {string} details.title - books.title
 * @param {number[]} details.genres - genre_id. many to many relationship with book
 * @param details.authors - genre_id. many to many relationship with book
 */
export async function updateBook(id: number, options: BookDetail) {
  const genres = [...new Set(options.genres)];
  const authors = [...new Set(options.authors)];

  const client = await psqlPool.connect();
  try {
    await client.query("BEGIN");

    // use Promise.all to send query and await in parallel, not waiting one to response first
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
    client.query("REFRESH MATERIALIZED VIEW book_details");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    // close connection and free resource after transaction
    client.release();
  }
}

/** delete a book using a transaction and refresh book_details view
 *
 * delete inactive loans manually and book details by cascade
 *
 * @param {number} id - unique book_id. database constrain: must be an integer
 */
export async function deleteBook(id: number) {
  const client = await psqlPool.connect();
  try {
    await client.query("BEGIN");

    // delete inactive (returned) loan first to remove reference
    // would leave active loan to cause error if there is any
    await client.query(
      "DELETE FROM loans WHERE book_id = $1 AND return_time IS NOT NULL",
      [id]
    );

    // cause cascade delete in book_genres and book_authors tables
    await client.query("DELETE FROM books WHERE book_id = $1", [id]);
    await client.query("REFRESH MATERIALIZED VIEW book_details");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    // close connection and free resource after transaction
    client.release();
  }
}

// --------------- genre ---------------

/** query database to check if all genres in ids exist
 *
 * @param {number} ids - array of unique genre_id.
 * database constraian: genre_id must be an integer
 * @returns {boolean}
 */
export async function isGenreIdsExist(ids: number[]) {
  return psqlPool
    .query("SELECT 1 FROM genres WHERE genre_id = ANY($1::int[])", [ids])
    .then((r) => r.rows.length == ids?.length);
}

/** query database to check if genre with spcific name exist
 *
 * @param {string} name - genre_name
 * @returns {boolean}
 */
export async function isGenreNameExist(genre: string) {
  return psqlPool
    .query("SELECT 1 FROM genres WHERE genre_name = $1", [genre])
    .then((r) => r.rows.length > 0);
}

/** get a list of genre filtered by name
 *
 * results ORDER BY exact match, patial math, and id
 *
 * @param search - search for matching with genre_name
 * @returns an array of genre {id, name}
 */
export async function getGenreList(search?: string) {
  return psqlPool
    .query(
      `SELECT genre_id as id, genre_name as name FROM genres 
      WHERE genre_name ILIKE '%'|| $1 || '%'
      ORDER BY (genre_name = $1), (genre_name ILIKE  $1 || '&'), genre_id`,
      [search ?? ""]
    )
    .then((r) => r.rows as BookPropEntity[]);
}

/** create new genre
 *
 * @param genre - genre_name to be created
 * @returns created genre_id
 */
export async function createGenre(genre: string) {
  return await psqlPool
    .query(
      "INSERT INTO genres (genre_name) VALUES ($1) RETURNING genre_id as id",
      [genre]
    )
    .then((r) => r.rows[0].id as number);
}

// --------------- author ---------------

/** query database to check if all authors in ids exist
 *
 * @param {number} ids - array of unique author_id.
 * database constraian: author_id must be an integer
 * @returns {boolean}
 */
export async function isAuthorIdsExist(ids: number[]) {
  return await psqlPool
    .query("SELECT 1 FROM authors WHERE author_id = ANY($1::int[])", [ids])
    .then((r) => Boolean(r.rows.length == ids?.length));
}

/** query database to check if author with spcific name exist
 *
 * @param {string} name - author_name
 * @returns {boolean}
 */
export async function isAuthorNameExist(author: string) {
  return psqlPool
    .query("SELECT 1 FROM authors WHERE author_name = $1", [author])
    .then((r) => r.rows.length > 0);
}

/** get a list of author filtered by name
 *
 * results ORDER BY exact match, patial math, and id
 *
 * @param search - search for matching with author_name
 * @returns an array of author {id, name}
 */
export async function getAuthorsList(search?: string) {
  return await psqlPool
    .query(
      `SELECT author_id as id, author_name as name FROM authors 
      WHERE author_name ILIKE '%'|| $1 || '%'
      ORDER BY (author_name = $1), (author_name ILIKE $1 || '&' ), author_id`,
      [search ?? ""]
    )
    .then((r) => r.rows as BookPropEntity[]);
}

/** create new author
 *
 * @param genre - genre_name to be created
 * @returns created author_id
 */
export async function createAuthor(author: string) {
  return await psqlPool
    .query(
      "INSERT INTO authors (author_name) VALUES ($1) RETURNING author_id as id",
      [author]
    )
    .then((r) => r.rows[0].id as number);
}
