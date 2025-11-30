import { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  SearchBook,
  filterDefault,
} from "@/features/books/components/searchbook.tsx";
import { BookTable } from "@/features/books/components/booktable.tsx";
import { useBookList } from "@/features/books/hooks.ts/useBookList.ts";
import { EditBookModal } from "./EditBookModal";
import type { BookData, BookFilter } from "@/features/books/type.ts";

export function BooksPage() {
  const [filter, setFilter] = useState<BookFilter>(filterDefault);
  const [editing, setEditing] = useState(false);
  const refreshRef = useRef(0);
  const books = useBookList(filter, refreshRef.current);
  const [editingBook, setEditingBook] = useState<BookData | null>(null);

  return (
    <>
      <EditBookModal
        book={editingBook}
        open={editing}
        setClose={() => setEditing(false)}
        onSave={() => {
          ++refreshRef.current;
        }}
      />
      <div>
        <h1 className="mt-8 mb-4 text-2xl font-bold">Books</h1>
        <SearchBook filter={filter} setFilter={setFilter} />
        <Button
          className="my-4"
          onClick={() => {
            setEditingBook(null);
            setEditing(true);
          }}
        >
          Create Book
        </Button>
        <BookTable
          books={books}
          caption="books"
          onSelect={(book) => {
            setEditingBook(book);
            setEditing(true);
          }}
        />
      </div>
    </>
  );
}
