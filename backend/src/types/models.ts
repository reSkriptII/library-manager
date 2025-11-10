export type UserData = {
  id: number;
  name: string;
  email: string;
  role: "member" | "librarian" | "admin";
};

export type LoanObject = {
  loan_id: number;
  borrower_id: number;
  book_id: number;
  borrow_time: Date;
  due_date: Date;
  return_time: Date;
};
