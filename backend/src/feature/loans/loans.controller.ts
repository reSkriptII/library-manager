import * as services from "./loans.services.js";
import * as Loans from "./loans.types.js";

/** send an array of loan details filtered by query parameter
 *
 * @param {unknown} req.query.active - filter for active (not returned) loans.
 * set to true if is in boolean flag format, empty value, "true", or "1"
 * @param {string} req.query.bookId - filter for loans of a book. internally convert to integer
 * @param req.query.borrowerId - filter for loans of an user. internally convert to integer
 */
export const getLoans: Loans.GetLoansCtrler = async function (req, res, next) {
  const active = req.query.active;
  const bookId = Number(req.query.bookId);
  const borrowerId = Number(req.query.borrowerId);

  const isActiveNotValid = Array.isArray(active);
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

  try {
    const loans = await services.getSearchLoans({
      active: active != undefined ? ["", "true", "1"].includes(active) : false,
      bookId: bookId ? Number(bookId) : null,
      borrowerId: borrowerId ? Number(borrowerId) : null,
    });
    return res.status(200).send(loans);
  } catch (error) {
    return next(error);
  }
};

/** save a new loan
 *
 * @param {number} req.body.bookId - a book id to be loan
 * @param {number} req.body.borrowerId - a user id of a borrower
 */
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
    return res.status(400).send({ message: loan.message });
  }

  return res
    .status(201)
    .send({ id: loan.id, dueDate: loan.dueDate.toISOString() });
};

/** set a loan with /:id as returned.
 *
 * @param {string} req.param.loanId - a loan id to be returned. internally convert to integer
 * @param {number} req.body.bookId - an optional check for book id to match a book in the loan
 * @param {number} req.body.borrowerId - an optional check for borrower id to match a user in the loan
 */
export const returnBook: Loans.SubmitReturnCrler = async function (
  req,
  res,
  next
) {
  const loanId = Number(req.params.id);

  if (!Number.isInteger(loanId)) {
    return res.status(400).send({ message: "Invalid loan ID" });
  }

  if (req.body?.bookId && Number.isInteger(Number(req.body.bookId))) {
    return res.status(400).send({ message: "Invalid book ID" });
  }
  if (req.body?.borrowerId && Number.isInteger(Number(req.body.borrowerId))) {
    return res.status(400).send({ message: "Invalid borrower ID" });
  }

  try {
    const returnResult = await services.returnBook(loanId, req.body);
    if (!returnResult.ok) {
      return res
        .status(returnResult.status)
        .send({ message: returnResult.message });
    }
    const { returnTime, lateReturn } = returnResult;
    return res.status(200).send({ returnTime, lateReturn });
  } catch (error) {
    return next(error);
  }
};
