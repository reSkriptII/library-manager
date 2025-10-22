import { Request, Response } from "express";
import { psqlPool } from "#util/db.js";
import { extractNum } from "#util/extractNum.js";

export async function sendBooks(req: Request, res: Response) {
  const { search, field, availableOnly, limit, offset } = req.query;
  const limitNum = extractNum(limit);
  const offsetNum = extractNum(offset);

  try {
    if (
      ["title", "author", "genre", "undefined"].includes(String(field)) ||
      search === undefined
    ) {
      const queryResult = await psqlPool.query(
        `SELECT books.book_id, books.title, books.availability,
        a.genres as genres,
        b.authors as authors
        FROM books
        JOIN 
          (SELECT books.book_id, array_agg(genre_name) as genres
            FROM books 
              LEFT JOIN book_genres bg ON books.book_id = bg.book_id
              JOIN genres ON bg.genre_id = genres.genre_id
              GROUP BY books.book_id
          ) a ON books.book_id = a.book_id
        JOIN 
          (SELECT books.book_id, array_agg(name) as authors
            FROM books
              LEFT JOIN book_authors ba ON books.book_id = ba.book_id
              JOIN authors ON ba.author_id = authors.author_id
              GROUP BY books.book_id
          ) b ON books.book_id = b.book_id
        ${
          field == undefined
            ? "WHERE $1 LIKE '%%'"
            : field === "title"
              ? "WHERE books.title ILIKE '%' || $1 || '%'"
              : `WHERE EXISTS (SELECT 1 FROM unnest(${field + "s"}) as listelem
                WHERE listelem LIKE '%' || $1 || '%')`
        }
          ${availableOnly === "true" ? "AND availability = true" : ""}
        LIMIT $2
        OFFSET $3`,
        [search ?? "", limitNum ?? null, offsetNum ?? null]
      );

      const booksData = queryResult?.rows ?? [];

      return res.json(
        booksData?.map((book) => {
          return {
            id: book.book_id,
            title: book.title,
            authors: book.authors,
            genres: book.genres,
            available: book.availability,
          };
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
}
