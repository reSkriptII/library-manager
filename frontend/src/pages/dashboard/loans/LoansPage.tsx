import { useState } from "react";
import { LoansForm } from "./LoansForm";
import type { Search } from "./LoansForm";
import { BorrowBookSection } from "./BorrowBookSection";
import { ReturnBookSection } from "./ReturnBookSection";

const loanFilterDefault: Search = {
  borrowerId: 0,
  bookId: 0,
  bookTitle: "",
  mode: "return",
};

export function LoansPage() {
  const [search, setSearch] = useState<Search>(loanFilterDefault);

  return (
    <>
      <h1 className="mt-8 mb-4 text-2xl font-bold">Borrow & Return books</h1>
      <LoansForm search={search} onChange={setSearch} />
      {search.mode === "borrow" ? (
        <BorrowBookSection search={search} setSearch={setSearch} />
      ) : (
        <ReturnBookSection search={search} setSearch={setSearch} />
      )}
    </>
  );
}
