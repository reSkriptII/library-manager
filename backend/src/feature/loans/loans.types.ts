import { Middleware } from "#src/types/express.js";
export type LoanData = {
  id: number;
  borrower: number;
  book: number;
  borrowAt: Date;
  dueDate: Date;
  returned: boolean;
  lateReturn: boolean | null;
  returnTime: Date | null;
};
export namespace Getloans {
  export type ReqQuery = { active?: boolean; borrower?: string; book?: string };
  export type ResBody = LoanData[];
}
export type GetLoansCtrler = Middleware<
  {},
  Getloans.ReqQuery,
  unknown,
  Getloans.ResBody
>;

export namespace SubmitLoans {
  export type ReqBody = {
    borrower: number;
    book: number;
  };
  export type ResBody = {
    id: number;
    due_date: string;
  };
}
export type SubmitLoansCtrler = Middleware<{}, {}, SubmitLoans.ReqBody>;

export namespace SubmitReturn {
  export type ReqBody = {
    borrower: number;
    book: number;
  };

  export type ResBody = {
    returnTime: Date;
    dueDate: Date;
    lateReturn: boolean;
  };
}
export type SubmitReturnCrler = Middleware<
  {},
  {},
  SubmitReturn.ReqBody,
  SubmitReturn.ResBody
>;
