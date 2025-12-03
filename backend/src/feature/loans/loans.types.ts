import type { Middleware } from "../../types/express.js";
import type { LoanData } from "../../types/app.js";
export type { LoanObject } from "../../types/models.js";
export type { LoanData };

export namespace Getloans {
  export type ReqQuery = {
    active?: string;
    borrowerId?: string;
    bookId?: string;
  };
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
