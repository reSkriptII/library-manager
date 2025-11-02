import { psqlPool } from "#util/db.js";

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
      WHERE ($1::int IS NULL OR id = 1)
        AND ($2::text IS NULL OR title ILIKE '%' || $2 || '%')
        AND ($3::int[] IS NULL OR id IN 
          (SELECT book_id FROM book_authors WHERE author_id = ANY($3)))
        AND ($4::int[] IS NULL OR id IN
          (SELECT book_id FROM book_genres WHERE genre_id = ANY($4)))`,
      [id, title, author ?? null, genre ?? null]
    )
    .then((r) => r.rows);
}
