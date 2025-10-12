import { Request, Response } from "express";

const books = [
  {
    id: 1,
    title: "bookTitle",
    author: "Jonh Doe",
    genre: ["genre1", "genre2"],
    available: true,
  },
  {
    id: 2,
    title: "bookTitle2",
    author: "Steve A",
    genre: ["genre3", "genre4"],
    available: true,
  },
  {
    id: 3,
    title: "Title 3",
    author: "me",
    genre: ["genre5", "genre6"],
    available: false,
  },
];

export function sendBooks(req: Request, res: Response) {
  res.json(books);
}
