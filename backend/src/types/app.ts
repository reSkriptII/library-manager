export type UserData = {
  id: number;
  name: string;
  email: string;
  role: "member" | "librarian" | "admin";
};

export type LoanData = {
  id: number;
  borrowerId: number;
  bookId: number;
  borrowTime: string;
  dueDate: string;
  returned: boolean;
  isLateReturn: boolean | null;
  returnTime: string | null;
};
