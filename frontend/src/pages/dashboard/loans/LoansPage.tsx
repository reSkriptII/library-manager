import { useEffect, useState } from "react";
import { LoansForm } from "./LoansForm";
import { DetailSection } from "./DetailSection";
import { LoanTable } from "./loantable.tsx";
import { useGetUser } from "@/features/users/hooks.ts";
import type { LoansFilter } from "./LoansForm";
import type { Loan } from "./loantable";
import { useDebounceValue } from "#root/hooks/useDebounceValue.ts";

const loanFilterDefault = {
  borrowerId: 0,
  bookId: 0,
  bookTitle: "",
  mode: "borrow",
};
export function LoansPages() {
  const [loanFilter, setLoanFilter] = useState<LoansFilter>(
    loanFilterDefault as LoansFilter,
  );
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const borrower = useGetUser(loanFilter.borrowerId);

  useEffect(() => {}, [loanFilter.bookId]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Borrow & Return books</h1>
      <LoansForm filter={loanFilter} onChange={setLoanFilter} />
      <DetailSection
        mode={loanFilter.mode}
        user={borrower}
        bookTitle={selectedLoan?.bookTitle}
        dueDate={selectedLoan?.dueDate}
      />
      <LoanTable
        loans={[
          {
            bookId: 1,
            bookTitle: "test",
            borrowerId: 1,
            borrowTime: new Date(),
            dueDate: new Date(),
          },
        ]}
        mode={loanFilter.mode}
        onSelect={(loan) => setSelectedLoan(loan)}
      />
    </>
  );
}
