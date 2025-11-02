import { psqlPool } from "#util/db.js";
import { BookSearchParam } from "./books.types.js";

export async function getAllBooks() {
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

export async function searchBooks({ title, author, genre }: BookSearchParam) {
  if (title == undefined && author == undefined && genre == undefined)
    throw new Error("books.model.SearchBooks: no search param");

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
      WHERE ($1::text IS NULL OR title ILIKE '%' || $1 || '%')
        AND ($2::int[] IS NULL OR id IN 
          (SELECT book_id FROM book_authors WHERE author_id = ANY($2)))
        AND ($3::int[] IS NULL OR id IN
          (SELECT book_id FROM book_genres WHERE genre_id = ANY($3)))`,
      [title, author ?? null, genre ?? null]
    )
    .then((r) => r.rows);
}
