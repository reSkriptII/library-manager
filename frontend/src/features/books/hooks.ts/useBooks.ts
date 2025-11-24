import { useEffect, useState } from "react";
import qs from "qs";
import { api } from "@/lib/api.ts";
import type { BookFilter, BookPropEntity } from "../type";
import type { BookData } from "../type";

export function useBooks(filter: BookFilter) {
  const [books, setBooks] = useState<BookData[]>([]);

  useEffect(() => {
    let isMount = true;

    const params = {
      title: filter.title !== "" ? filter.title : undefined,
      genre: filter.genres.map((genre) => genre.id),
      author: filter.author?.id,
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

        setBooks(res.data);
      } catch {
        setBooks([]);
      }
    })();

    return () => {
      isMount = false;
    };
  }, [filter.title, filter.author, filter.genres]);

  return books;
}
