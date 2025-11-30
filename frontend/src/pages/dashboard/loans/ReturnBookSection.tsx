import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { LoanTable } from "@/features/loans/components/loantable.tsx";
import { useLoans } from "@/features/loans/hooks.ts";
import { useBook } from "@/features/books/hooks.ts/useBook.ts";
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
  const selectedBook = useBook(search?.bookId ?? null);
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
        showDisclaimer={Boolean(search.bookId && !isBookInLoans)}
      />
      <SubmitReturnButton
        loanId={selectedLoan?.id ?? null}
        disabled={!isBookInLoans}
        onAfterSubmit={() => {
          setSearch({ ...search, bookId: 0 });
          ++refreshRef.current;
        }}
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

type SubmitReturnButtonProps = {
  loanId: number | null;
  disabled: boolean;
  onAfterSubmit?: () => void;
};
function SubmitReturnButton({
  loanId,
  disabled,
  onAfterSubmit,
}: SubmitReturnButtonProps) {
  const [loading, setLoading] = useState(false);
  async function handleSubmit() {
    if (!loanId) return toast.error("Invalid loan");
    setLoading(true);
    const res = await returnLoans(loanId);
    if (res?.ok) {
      toast.success("successfully return a book");
    } else {
      toast.error(res?.message ?? "unknow error");
    }
    setLoading(false);
    onAfterSubmit?.();
  }

  return (
    <Button
      className="text-xl sm:col-span-2"
      disabled={disabled || loading}
      onClick={handleSubmit}
    >
      {loading ? "loading" : "Return Book"}
    </Button>
  );
}
