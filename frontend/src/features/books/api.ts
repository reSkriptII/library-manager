import { AxiosError } from "axios";
import { api } from "@/lib/api.ts";
import type { BookPropEntity } from "./type";

export async function getBook(id: number) {
  try {
    const res = await api.get(`/books/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

type CreateBookDetails = {
  title: string;
  genres: number[];
  authors: number[];
};

export async function createBook(details: CreateBookDetails, cover?: File) {
  const detailsJson = JSON.stringify(details);
  const form = new FormData();
  form.append("details", detailsJson);
  if (cover) form.append("coverImage", cover);

  try {
    await api.post("/books", form);
    return { ok: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: error.response?.data.message,
        };
      }
    }
  }
}

export async function updateBook(
  id: number,
  bookData: { title: string; genres: number[]; authors: number[] },
) {
  try {
    await api.put(`/books/${id}`, bookData);
    return { ok: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: error.response?.data.message,
        };
      }
    }
  }
}

export async function deleteBook(id: number) {
  try {
    await api.delete(`/books/${id}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: error.response?.data.message,
        };
      }
    }
  }
}

export async function updateBookCover(id: number, cover: File) {
  if (!cover) return;
  try {
    const form = new FormData();
    form.append("coverImage", cover);

    await api.put(`/books/${id}/cover`, form);
    return { ok: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: error.response?.data.message,
        };
      }
    }
  }
}

type CreateGenreResponse =
  | { ok: true; genre: BookPropEntity }
  | { ok: false; message: string };

export async function createGenre(
  genre: string,
): Promise<CreateGenreResponse | undefined> {
  if (!genre) return;
  try {
    const res = await api.post("/books/genres", { genre });
    return { ok: true, genre: res.data };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: error.response?.data.message,
        };
      }
    }
  }
}

export async function createAuthor(author: string) {
  if (!author) return;
  try {
    const res = await api.post("/books/authors", { genre: author });
    return { ok: true, authors: res.data };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: error.response?.data.message,
        };
      }
    }
  }
}
