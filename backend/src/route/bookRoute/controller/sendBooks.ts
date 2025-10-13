import { Request, Response } from "express";
import { psqlPool } from "@util/db.js";

type reqBody = {
  data: string;
  searchField: "title" | "author" | "genre";
  availableOnly: boolean;
};

export async function sendBooks(
  req: Request<any, any, reqBody>,
  res: Response
) {
  const queryResult = await psqlPool.query(
    "SELECT book_id, title, author, availability FROM books"
  );
  const booksData = queryResult.rows;

  res.json(
    booksData.map((book) => {
      return {
        id: book.book_id,
        title: book.title,
        author: book.author,
        available: book.availablility,
      };
    })
  );
}
