export type LoanObject = {
  loan_id: number;
  borrower_id: number;
  book_id: number;
  title: string;
  borrow_time: Date;
  due_date: Date;
  return_time: Date;
};
