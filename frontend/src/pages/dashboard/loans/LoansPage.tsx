import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { LoansForm } from "./LoansForm";
import { DetailSection } from "./DetailSection";
import { LoanTable } from "@/features/loans/components/loantable.tsx";
import { useGetUser } from "@/features/users/hooks.ts";
import type { LoanFilter } from "./LoansForm";
import { useUserLoan } from "@/features/loans/hooks.ts";
import { useBook } from "@/features/books/hooks.ts/useBook.ts";
import type { LoanData } from "@/features/loans/types.ts";
import { SubmitButton } from "./submitbutton";

const loanFilterDefault: LoanFilter = {
  borrowerId: 0,
  bookId: 0,
  bookTitle: "",
  mode: "return",
};

export function LoansPages() {
  const [loanFilter, setLoanFilter] = useState<LoanFilter>(loanFilterDefault);
  const [selectedLoan, setSelectedLoan] = useState<LoanData | null>(null);
  const borrower = useGetUser(loanFilter.borrowerId);
  const { loans, refreshLoans } = useUserLoan(loanFilter.borrowerId);
  const bookById = useBook(loanFilter.bookId);

  const currentDueDate =
    loanFilter.mode === "borrow"
      ? getTimeStampDaysFromNow(10)
      : selectedLoan?.dueDate
        ? new Date(selectedLoan.dueDate)
        : null;
  const isBookInLoans = Boolean(
    loanFilter.mode !== "return" ||
      !loanFilter.bookId ||
      !bookById ||
      loans.find((loan) => loanFilter.bookId === loan.bookId),
  );

  function handleSelectLoan(loan: LoanData) {
    setLoanFilter({
      ...loanFilter,
      bookId: loan.bookId,
    });
    setSelectedLoan(loan);
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Borrow & Return books</h1>
      <LoansForm filter={loanFilter} onChange={setLoanFilter} />
      <DetailSection
        user={borrower}
        book={bookById}
        dueDate={currentDueDate}
        validBook={isBookInLoans}
      />
      <SubmitButton
        mode={loanFilter.mode}
        returnLoanId={selectedLoan?.id}
        borrowData={{
          borrowerId: loanFilter.borrowerId,
          bookId: loanFilter.bookId,
        }}
        onClick={() => {
          setLoanFilter({ ...loanFilter, bookId: 0, bookTitle: "" });
          refreshLoans();
        }}
      />
      {loanFilter.mode === "return" && (
        <LoanTable
          loans={
            loanFilter.bookTitle
              ? loans.filter((loan) =>
                  loan.bookTitle.includes(loanFilter.bookTitle),
                )
              : loans
          }
          onSelect={handleSelectLoan}
        />
      )}
    </>
  );
}

function getTimeStampDaysFromNow(day: number) {
  const date = new Date();
  date.setDate(date.getDate() + day);
  return date;
}
