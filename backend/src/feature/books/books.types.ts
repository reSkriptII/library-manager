import type { Middleware } from "types/express.js";
import { editBook } from "./books.controllers.js";

export namespace Books {
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
      author: {
        id: number;
        name: string;
      }[];
      lent: boolean;
      reserveQueue: number;
    }[];

    export type Controller = Middleware<{}, ReqQuery, undefined, ResBody>;
  }

  export namespace GetBookById {
    export type ReqParam = { id: number };

    export type ResBody = {
      id: number;
      title: string;
      genres: {
        id: number;
        name: string;
      }[];
      author: {
        id: number;
        name: string;
      }[];
      lent: boolean;
      reserveQueue: number;
    } | null;

    export type Controller = Middleware<ReqParam, {}, undefined, ResBody>;
  }
  //#endregion
  //#region Book modification
  export namespace CreateBook {
    export type ReqBody = {
      title: string;
      genres: number[];
      authors: number[];
    };

    export type Controller = Middleware<{}, {}, ReqBody>;
  }

  export namespace EditBook {
    export type ReqBody = {
      title?: string;
      genres?: number[];
      authors?: number[];
    };

    export type Controller = Middleware<{}, {}, ReqBody>;
  }
  //#endregion

  export type CreateAuthorController = Middleware<{}, {}, { author: string }>;
  export type CreateGenreController = Middleware<{}, {}, { genre: string }>;
}
