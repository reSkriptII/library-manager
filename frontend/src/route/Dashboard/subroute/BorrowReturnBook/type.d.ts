export type FormData = {
  userId: number;
  bookId: number;
  isInvalid: boolean;
  borrowOrReturn: "borrow" | "return";
};

export type HandleFormDataChangeFunction = (
  field: "userId" | "bookId" | "isInvalid" | "borrowOrReturn",
  data: number | boolean | "borrow" | "return",
) => void;
