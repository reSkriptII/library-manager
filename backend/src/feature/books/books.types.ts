import type { Middleware } from "types/express.js";
import { updateBook } from "./books.controllers.js";

//#region Book retrieval
export namespace GetBooksList {
  export type ReqQuery = {
    title?: string;
    genre?: number | number[];
    author?: number | number[];
  };

  export type ResBody = {
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
  }[];

  export type Controller = Middleware<{}, ReqQuery, undefined, ResBody>;
}

export namespace GetBookById {
  export type ResBody = {
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
  } | null;

  export type Controller = Middleware<{ id: number }, {}, undefined, ResBody>;
}
//#endregion
//#region Book modification

export type CreateBookController = Middleware<{}, {}, { details: string }>;
export namespace UpdateBook {
  export type ReqBody = {
    title: string;
    genres: number[];
    authors: number[];
  };

  export type Controller = Middleware<{ id: number }, {}, ReqBody>;
}
//#endregion

export type BookPropEntity = { id: number; name: string };
export type GetGenresontroller = Middleware<{}, {}, any, BookPropEntity[]>;
export type GetAuthorsController = GetGenresontroller;

export type CreateAuthorController = Middleware<
  {},
  {},
  { author: string },
  BookPropEntity
>;
export type CreateGenreController = Middleware<
  {},
  {},
  { genre: string },
  BookPropEntity
>;
