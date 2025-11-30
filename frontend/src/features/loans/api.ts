import { api } from "@/lib/api.ts";
import { AxiosError } from "axios";

export async function makeLoan(loanReqBody: {
  borrowerId: number;
  bookId: number;
}) {
  try {
    const res = await api.post("/loans", loanReqBody);
    return { ok: true, dueDate: res.data.dueDate };
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: err.response?.data.message,
        };
      }
    }
  }
}

export async function returnLoans(loanId: number) {
  try {
    await api.post(`/loans/${loanId}/return`);
    return { ok: true };
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: err.response?.data.message ?? "unknow error",
        };
      }
    }
  }
}
