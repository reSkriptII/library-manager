import { api } from "#root/lib/api.ts";

export async function getBook(id: number) {
  try {
    const res = await api.get(`/books/${id}`);
    return res.data;
  } catch {
    return null;
  }
}
