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
  export type Controller = Middleware<{}, ReqQuery, unknown, ResBody>;
}
export type GetLoansCtrler = Getloans.Controller;

export namespace SubmitLoans {
  export type ReqBody = {
    borrowerId: number;
    bookId: number;
  };
  export type ResBody = {
    id: number;
    dueDate: string;
  };
  export type Controller = Middleware<{}, {}, ReqBody>;
}
export type SubmitLoansCtrler = SubmitLoans.Controller;

export namespace SubmitReturn {
  export type ReqBody = {
    borrowerId: number;
    bookId: number;
  };

  export type ResBody = {
    returnTime: Date;
    lateReturn: boolean;
  };
  export type Controller = Middleware<
    { id: string },
    {},
    ReqBody | undefined,
    ResBody
  >;
}
export type SubmitReturnCrler = SubmitReturn.Controller;
