import { useRef, useState } from "react";
import {
  SearchBook,
  filterDefault,
} from "@/features/books/components/searchbook.tsx";
import { useBookList } from "@/features/books/hooks.ts/useBookList.ts";
import type { BookData, BookFilter } from "#root/features/books/type.ts";
import { BookTable } from "#root/features/books/components/booktable.tsx";
import { EditBookModal } from "./EditBookModal";

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
        onClose={() => setEditing(false)}
        onSave={() => {
          ++refreshRef.current;
        }}
      />
      <div>
        <h1 className="mt-8 mb-4 text-2xl font-bold">Books</h1>
        <SearchBook filter={filter} setFilter={setFilter} />
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
