import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { DetailSection } from "./DetailSection";
import { BookTable } from "@/features/books/components/booktable.tsx";
import { useBookList } from "@/features/books/hooks.ts/useBookList.ts";
import { useBook } from "@/features/books/hooks.ts/useBook.ts";
import { makeLoan } from "@/features/loans/api.ts";
import type { Search } from "./LoansForm";

type BorrowSectionProps = {
  search: Search;
  setSearch: (filter: Search) => void;
};

export function BorrowBookSection({ search, setSearch }: BorrowSectionProps) {
  const selectedBook = useBook(search.bookId);
  const refreshBook = useRef(0);
  const books = useBookList(
    { title: search.bookTitle },
    refreshBook.current,
  ).filter((book) => !(book.reserveQueue || book.lent));

  const dueDate = getTimeStampDaysFromNow(10);
  const bookNotAvailable = Boolean(
    selectedBook?.reserveQueue || selectedBook?.lent,
  );

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
        disclaimer="Book is not available"
        showDisclaimer={bookNotAvailable}
      />
      <SubmitLoanButton
        bookId={selectedBook?.id ?? null}
        borrowerId={search.borrowerId}
        disabled={!selectedBook || bookNotAvailable}
        onAfterSubmit={() => {
          setSearch({ ...search, bookId: 0 });
          ++refreshBook.current;
        }}
      />
      <BookTable
        books={books}
        caption="available book"
        onSelect={(book) => {
          setSearch({ ...search, bookId: book.id });
        }}
      />
    </>
  );
}

type SubmitLoanButtonProps = {
  borrowerId: number;
  bookId: number | null;
  disabled: boolean;
  onAfterSubmit: () => void;
};

function SubmitLoanButton({
  borrowerId,
  bookId,
  disabled,
  onAfterSubmit,
}: SubmitLoanButtonProps) {
  const [loading, setLoading] = useState(false);
  async function handleSubmit() {
    if (!bookId || !borrowerId) return toast.error("Invalid loan data");

    setLoading(true);
    const res = await makeLoan({ borrowerId, bookId });
    if (res?.ok) {
      toast.success("successfully make a loan");
    } else {
      toast.error(res?.message ?? "unknow error");
    }
    setLoading(false);
    onAfterSubmit();
  }

  return (
    <Button
      className="text-xl sm:col-span-2"
      disabled={disabled || loading}
      onClick={handleSubmit}
    >
      {loading ? "loading" : "Borrow Book"}
    </Button>
  );
}

function getTimeStampDaysFromNow(day: number) {
  const date = new Date();
  date.setDate(date.getDate() + day);
  return date;
}
