import * as models from "./loans.models.js";
import * as bookModels from "#src/models/books.js";
import * as userModels from "#src/models/users.js";

export type LoanBook =
  | { ok: false; message: string }
  | { ok: true; id: number; dueDate: Date };

export async function loanBook(
  bookId: number,
  borrowerId: number
): Promise<LoanBook> {
  const [isBookExist, isBookAvailable] = await Promise.all([
    bookModels.isBookExist(bookId),
    bookModels.isBookAvailable(bookId),
  ]);
  if (!isBookExist) {
    return { ok: false, message: "Book not exist" };
  }
  if (!isBookAvailable) {
    return { ok: false, message: "Book not available" };
  }

  const isUserExist = await userModels.isUserExist(borrowerId);
  if (!isUserExist) {
    return { ok: false, message: "User not found" };
  }

  const loan = await models.createLoans(bookId, bookId);
  return { ok: true, id: loan.id, dueDate: new Date(loan.due_date) };
}
