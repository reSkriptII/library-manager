import { AxiosError } from "axios";
import { api } from "#root/lib/api.ts";
import type { BookPropEntity } from "./type";

export async function getBook(id: number) {
  try {
    const res = await api.get(`/books/${id}`);
    return res.data;
  } catch {
    return null;
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
