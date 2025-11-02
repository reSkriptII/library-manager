import type { Middleware } from "types/express.js";

export namespace Books {
  //#region Book retrieval
  export namespace getBooksList {
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

    export type controller = Middleware<{}, ReqQuery, undefined, ResBody>;
  }

  export namespace getBookById {}
  //#endregion
}
