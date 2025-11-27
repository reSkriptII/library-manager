import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { DetailSection } from "./DetailSection";
import { BookTable } from "@/features/books/components/booktable.tsx";
import { useBookList } from "@/features/books/hooks.ts/useBookList.ts";
import { useBook } from "@/features/books/hooks.ts/useBook.ts";
import { makeLoan } from "@/features/loans/api.ts";
import type { Search } from "./LoansForm";
import type { BookData } from "@/features/books/type.ts";

type BorrowSectionProps = {
  search: Search;
  setSearch: (filter: Search) => void;
};

export function BorrowBookSection({ search, setSearch }: BorrowSectionProps) {
  const selectedBook = useBook(search.bookId);
  const books = useBookList({ title: search.bookTitle }).filter(
    (book) => !(book.reserveQueue || book.lent),
  );

  const dueDate = getTimeStampDaysFromNow(10);
  const bookNotAvailable = Boolean(
    selectedBook?.reserveQueue || selectedBook?.lent,
  );

  function handleSelectBook(book: BookData) {
    setSearch({ ...search, bookId: book.id });
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
        disclaimer="Book is not available"
        showDisclaimer={bookNotAvailable}
      />
      <SubmitLoanButton
        bookId={selectedBook?.id ?? null}
        borrowerId={search.borrowerId}
        disabled={!selectedBook || bookNotAvailable}
      />
      <BookTable
        books={books}
        caption="available book"
        onSelect={handleSelectBook}
      />
    </>
  );
}

type SubmitLoanButtonProps = {
  borrowerId: number;
  bookId: number | null;
  disabled: boolean;
};

function SubmitLoanButton({
  borrowerId,
  bookId,
  disabled,
}: SubmitLoanButtonProps) {
  async function handleSubmit() {
    if (!bookId || !borrowerId) return toast.error("Invalid loan data");

    const res = await makeLoan({ borrowerId: 1, bookId });
    if (res?.ok) {
      return toast.success("successfully make a loan");
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

function getTimeStampDaysFromNow(day: number) {
  const date = new Date();
  date.setDate(date.getDate() + day);
  return date;
}
