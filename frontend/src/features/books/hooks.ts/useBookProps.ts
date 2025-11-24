import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api.ts";
import type { BookPropEntity } from "../type";

export function useGenres() {
  return useBookProps("genres");
}

export function useAuthors() {
  return useBookProps("authors");
}

function useBookProps(propName: string) {
  const [props, setProps] = useState<BookPropEntity[] | null>(null);

  useEffect(() => {
    let isMount = true;

    (async () => {
      try {
        const res = await api.get("/books/" + propName);
        if (isMount) setProps(res.data as BookPropEntity[]);
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.status as number;
          if (status >= 400) {
            setProps(null);
          }
        }
      }
    })();

    return () => {
      isMount = false;
    };
  }, []);

  return props;
}
