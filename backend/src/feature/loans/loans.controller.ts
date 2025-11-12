import * as services from "./loans.services.js";
import * as Loans from "./loans.types.js";

export const getLoans: Loans.GetLoansCtrler = async function (req, res, next) {
  const { active, book: bookId, borrower: borrowerId } = req.query;

  const isActiveNotValid = Array.isArray(req.query.active);
  const isBookIdNotValid = bookId && !Number.isInteger(bookId);
  const isBorrowerIdNotValid = borrowerId && !Number.isInteger(borrowerId);
  if (isBookIdNotValid || isBorrowerIdNotValid) {
    const field = [];
    if (isActiveNotValid) field.push("active");
    if (isBookIdNotValid) field.push("book");
    if (isBorrowerIdNotValid) field.push("borrower");
    return res
      .status(400)
      .send({ message: `Invalid query parameter: ${field.join(", ")}` });
  }

  let loans;
  try {
    loans = await services.getSearchLoans({
      active: active != undefined ? ["", "true", "1"].includes(active) : false,
      bookId: bookId ? Number(bookId) : null,
      borrowerId: borrowerId ? Number(borrowerId) : null,
    });
  } catch (error) {
    return next(error);
  }

  if (!loans.ok) {
    return res.status(400).send({ message: loans.message });
  }
  return res.status(200).send(loans.loans);
};

export const loanBook: Loans.SubmitLoansCtrler = async function (
  req,
  res,
  next
) {
  const bookId = Number(req.body?.bookId);
  const borrowerId = Number(req.body?.borrowerId);

  if (!Number.isInteger(bookId) || !Number.isInteger(borrowerId)) {
    const field = [];
    if (!Number.isInteger(bookId)) field.push("book ID");
    if (!Number.isInteger(borrowerId)) field.push("borrower ID");
    return res.status(400).send({ message: `Invalid ${field.join(", ")}` });
  }

  let loan;
  try {
    loan = await services.loanBook(bookId, borrowerId);
  } catch (error) {
    return next(error);
  }

  if (!loan.ok) {
    return res.status(400).send(loan.message);
  }

  return res
    .status(201)
    .send({ id: loan.id, dueDate: loan.dueDate.toISOString() });
};

export const returnBook: Loans.SubmitReturnCrler = async function (
  req,
  res,
  next
) {
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

  let returnResult;
  try {
    returnResult = await services.returnBook(loanId, req.body);
    if (!returnResult.ok) {
      return res
        .status(returnResult.status)
        .send({ message: returnResult.message });
    }
  } catch (error) {
    return next(error);
  }
  const { returnTime, lateReturn } = returnResult;
  return res.status(200).send({ returnTime, lateReturn });
};
