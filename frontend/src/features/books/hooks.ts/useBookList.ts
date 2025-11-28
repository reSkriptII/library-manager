import { useEffect, useState } from "react";
import qs from "qs";
import { api } from "@/lib/api.ts";
import type { BookFilter } from "../type";
import type { BookData } from "../type";

export function useBookList(filter: BookFilter, refresh?: any) {
  const [books, setBooks] = useState<BookData[]>([]);

  useEffect(() => {
    let isMount = true;

    const params = {
      title: filter.title && filter.title !== "" ? filter.title : undefined,
      genre: filter.genres && filter.genres.map((genre) => genre.id),
      author: filter.author && filter.author?.id,
    };

    (async () => {
      try {
        const res = await api.get("/books", {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          },
        });

        if (isMount) setBooks(res.data);
      } catch {
        if (isMount) setBooks([]);
      }
    })();

    return () => {
      isMount = false;
    };
  }, [filter.title, filter.author, filter.genres, refresh]);

  return books;
}
