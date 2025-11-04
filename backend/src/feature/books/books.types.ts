import type { Middleware } from "types/express.js";
import { updateBook } from "./books.controllers.js";

//#region Book retrieval
type BookData = {
  id: number;
  title: string;
  genres: {
    id: number;
    name: string;
  }[];
  authors: {
    id: number;
    name: string;
  }[];
  lent: boolean;
  reserveQueue: number;
};
export namespace GetBooksList {
  export type ReqQuery = {
    title?: string;
    genre?: string | string[];
    author?: string | string[];
  };

  export type Controller = Middleware<{}, ReqQuery, undefined, BookData[]>;
}
export type GetBooksListCtrler = GetBooksList.Controller;
export type GetBookByIdCtrler = Middleware<
  { id: string },
  {},
  undefined,
  BookData | null
>;
//#endregion
//#region Book modification
export type CreateBookCtrler = Middleware<
  {},
  {},
  { details: string },
  { bookId: number }
>;
export namespace UpdateBook {
  export type ReqBody = {
    title: string;
    genres: number[];
    authors: number[];
  };

  export type Controller = Middleware<{ id: number }, {}, ReqBody>;
}
export type UpdateBookCtrler = UpdateBook.Controller;
//#endregion

export type BookPropEntity = { id: number; name: string };
export type GetGenresCtrler = Middleware<
  {},
  { search?: string },
  any,
  BookPropEntity[]
>;
export type GetAuthorsCtrler = GetGenresCtrler;

export type CreateAuthorCtrler = Middleware<
  {},
  {},
  { author: string },
  BookPropEntity
>;
export type CreateGenreCtrler = Middleware<
  {},
  {},
  { genre: string },
  BookPropEntity
>;
