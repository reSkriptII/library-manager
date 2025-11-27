import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { LoanTable } from "@/features/loans/components/loantable.tsx";
import { useLoans } from "@/features/loans/hooks.ts";
import { useBook } from "#root/features/books/hooks.ts/useBook.ts";
import { returnLoans } from "@/features/loans/api.ts";
import { DetailSection } from "./DetailSection";
import type { Search } from "./LoansForm";
import type { LoanData } from "@/features/loans/types.ts";

type ReturnSectionProps = {
  search: Search;
  setSearch: (search: Search) => void;
};

export function ReturnBookSection({ search, setSearch }: ReturnSectionProps) {
  const [selectedLoan, setSelectedLoan] = useState<LoanData | null>(null);
  const refreshRef = useRef(0);
  const selectedBook = useBook(selectedLoan?.bookId ?? null);
  const loans = useLoans(search.borrowerId, refreshRef.current);

  const dueDate = selectedLoan?.dueDate ? new Date(selectedLoan.dueDate) : null;
  const isBookInLoans = Boolean(
    loans.find((loan) => search.bookId === loan.bookId),
  );

  function handleSelectLoan(loan: LoanData) {
    setSearch({ ...search, bookId: loan.bookId });
    setSelectedLoan(loan);
  }

  return (
    <>
      <DetailSection
        borrowerId={search.borrowerId}
        book={
          selectedBook
            ? { id: selectedBook.id, title: selectedBook.title }
            : null
        }
        dueDate={dueDate}
        disclaimer="This book isn't borrowed by user"
        showDisclaimer={!search.bookId || !isBookInLoans}
      />
      <SubmitReturnButton
        loanId={selectedLoan?.id ?? null}
        disabled={!isBookInLoans}
      />
      <LoanTable
        loans={
          search.bookTitle
            ? loans.filter((loan) => loan.bookTitle.includes(search.bookTitle))
            : loans
        }
        onSelect={handleSelectLoan}
      />
    </>
  );
}

type SubmitReturnButtonProps = { loanId: number | null; disabled: boolean };
function SubmitReturnButton({ loanId, disabled }: SubmitReturnButtonProps) {
  async function handleSubmit() {
    if (!loanId) return toast.error("Invalid loan");

    const res = await returnLoans(loanId);
    if (res?.ok) {
      return toast.success("successfully return a book");
    } else {
      return toast.error(res?.message ?? "unknow error");
    }
  }

  return (
    <Button
      className="text-xl sm:col-span-2"
      disabled={disabled}
      onClick={handleSubmit}
    >
      Borrow Book
    </Button>
  );
}
