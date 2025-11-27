import { useState, useEffect } from "react";
import type { BookData } from "../type";
import { api } from "@/lib/api.ts";

export function useBook(id: number | null) {
  const [books, setBooks] = useState<BookData | null>(null);

  useEffect(() => {
    let isMount = true;

    (async () => {
      if (!id) {
        return setBooks(null);
      }

      try {
        const res = await api.get(`/books/${id}`);
        if (isMount) setBooks(res.data);
      } catch {
        if (isMount) setBooks(null);
      }
    })();

    return () => {
      isMount = false;
    };
  }, [id]);

  return books;
}
