import * as models from "./loans.models.js";
import * as bookModels from "../../models/books.js";
import * as userModels from "../../models/users.js";
import { CONFIG } from "../../config/constant.js";

export async function getSearchLoans(search: models.SearchLoans) {
  const loans = await models.searchLoans(search);

  return loans.map((loan) => ({
    id: loan.loan_id,
    bookId: loan.book_id,
    bookTitle: loan.title,
    borrowerId: loan.borrower_id,
    borrowTime: loan.borrow_time.toISOString(),
    dueDate: loan.due_date.toISOString(),
    returned: loan.return_time != null,
    isLateReturn:
      loan.return_time == null ? null : loan.return_time > loan.due_date,
    returnTime: loan.due_date.toISOString(),
  }));
}

export type LoanBook =
  | { ok: true; id: number; dueDate: Date }
  | { ok: false; message: string };

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

  try {
    const loan = await models.createLoans(
      bookId,
      borrowerId,
      CONFIG.BORROW_INTERVAL
    );
    return { ok: true, id: loan.id, dueDate: new Date(loan.due_date) };
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (String(err.code).startsWith("23")) {
        return { ok: false, message: "Error creating loan" };
      }
    }
    throw err;
  }
}

export type ReturnBook =
  | { ok: true; dueDate: Date; returnTime: Date; lateReturn: boolean }
  | { ok: false; status: number; message: string };

export async function returnBook(
  loanId: number,
  checkProps?: { bookId: number; borrowerId: number }
): Promise<ReturnBook> {
  const loan = await models.getLoanById(loanId);
  if (loan == null) {
    return { ok: false, status: 404, message: "Loan not found" };
  }
  if (loan.return_time != null) {
    return { ok: false, status: 409, message: "Loan is returned" };
  }
  if (checkProps) {
    if (
      checkProps.bookId != loan.book_id ||
      checkProps.borrowerId != loan.borrower_id
    ) {
      return {
        ok: false,
        status: 400,
        message: "borrower ID and book ID don't match the loan",
      };
    }
  }

  const { return_time, due_date } = await models.returnBook(loanId);
  return {
    ok: true,
    dueDate: due_date,
    returnTime: return_time,
    lateReturn: return_time > due_date,
  };
}

export async function verifyLoan(
  loanId: number,
  bookId: number,
  borrowerId: number
) {}
