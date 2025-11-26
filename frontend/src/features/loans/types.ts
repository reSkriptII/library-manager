export type LoanData = {
  id: number;
  borrowerId: number;
  bookId: number;
  bookTitle: string;
  borrowTime: string;
  dueDate: string;
  returned: boolean;
  isLateReturn: boolean | null;
  returnTime: string | null;
};
