import * as services from "./loans.services.js";
import * as Loans from "./loans.types.js";

export const getLoans: Loans.GetLoansCtrler = async function (req, res) {};

export const loanBook: Loans.SubmitLoansCtrler = async function (req, res) {
  const bookId = Number(req.body?.bookId);
  const borrowerId = Number(req.body?.borrowerId);

  if (!Number.isInteger(bookId) || !Number.isInteger(borrowerId)) {
    const field = [];
    if (!Number.isInteger(bookId)) field.push("book ID");
    if (!Number.isInteger(borrowerId)) field.push("borrower ID");
    return res.status(400).send({ message: `Invalid ${field.join(", ")}` });
  }

  const loan = await services.loanBook(bookId, borrowerId);

  if (!loan.ok) {
    return res.status(400).send(loan.message);
  }

  return res
    .status(201)
    .send({ id: loan.id, dueDate: loan.dueDate.toISOString() });
};

export const returnBook: Loans.SubmitReturnCrler = async function (req, res) {
  const loanId = Number(req.params.id);

  if (!Number.isInteger(loanId)) {
    return res.status(400).send({ message: "Invalid loan ID" });
  }
  if (req.body) {
    if (Number.isInteger(Number(req.body.bookId))) {
      return res.status(400).send({ message: "Invalid book ID" });
    }
    if (Number.isInteger(Number(req.body.borrowerId))) {
      return res.status(400).send({ message: "Invalid borrower ID" });
    }
  }

  const returnResult = await services.returnBook(loanId, req.body);
  if (!returnResult.ok) {
    return res
      .status(returnResult.status)
      .send({ message: returnResult.message });
  }
  const { returnTime, lateReturn } = returnResult;
  return res.status(200).send({ returnTime, lateReturn });
};
