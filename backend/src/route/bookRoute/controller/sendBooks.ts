import { Request, Response } from "express";
import { psqlPool } from "@util/db.js";
import { lutimes } from "fs";
import { off } from "process";
import type { QueryResult } from "pg";

type searchField = "title" | "author" | "genre";
type reqQuery = {
  search: string;
  field: searchField;
  available: "true" | undefined;
  limit: `${number}` | undefined;
  offset: `${number}` | undefined;
};

export async function sendBooks(
  req: Request<any, any, any, reqQuery>,
  res: Response
) {
  function extractNum(value: any) {
    if (value == null || isNaN(Number(limit))) return null;
    return Number(value);
  }

  const { search, field, available, limit, offset } = req.query;
  const limitNum = extractNum(limit);
  const offsetNum = extractNum(offset);

  let queryResult: QueryResult | null = null;
  try {
    if (search && field === "genre") {
      // TODO
    } else if (search && ["title", "author"].includes(field)) {
      queryResult = await psqlPool.query(
        `SELECT book_id, title, author, availability 
        FROM books
        WHERE title LIKE '%' || $1 || '%'
          ${available === "true" ? "AND availability = true" : ""}
        LIMIT $2
        OFFSET $3`,
        [search, limitNum, offsetNum]
      );
    } else {
      queryResult = await psqlPool.query(
        `SELECT book_id, title, author, availability 
        FROM books
        ${available === "true" ? "WHERE availability = true" : ""}
        LIMIT $1
        OFFSET $2`,
        [limitNum, offsetNum]
      );
    }
  } catch (err) {
    console.log(err);
  }

  const booksData = queryResult?.rows ?? [];

  res.json(
    booksData?.map((book) => {
      return {
        id: book.book_id,
        title: book.title,
        author: book.author,
        available: book.availablility,
      };
    })
  );
}
