import { SearchBook } from "@/features/books/components/searchbook.tsx";
import { useState } from "react";
import type { BookFilter } from "@/features/books/type";
import { useBooks } from "#root/features/books/hooks.ts/useBooks.ts";
import { useDebounceValue } from "#root/hooks/useDebounceValue.ts";
import { BookCard } from "@/features/books/components/bookcard.tsx";

const filterDefault = { title: "", genres: [], author: null };

export function BookSection() {
  const [filter, setFilter] = useState<BookFilter>(filterDefault);
  const debouncedFilter = useDebounceValue(filter, 500);
  const books = useBooks(debouncedFilter);
  console.log(books);

  return (
    <section className="py-12">
      <Search filter={filter} setFilter={setFilter} />
      <div className="my-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
        {books && books.map((book) => <BookCard book={book} key={book.id} />)}
      </div>
    </section>
  );
}

type SearchProps = {
  filter: BookFilter;
  setFilter: (filter: BookFilter) => void;
};

export function Search({ filter, setFilter }: SearchProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold">
        <img
          className="relative -top-1 inline size-12 pr-2"
          src="/search.svg"
          aria-hidden
        />
        Search for books
      </h2>
      <SearchBook filter={filter} setFilter={setFilter} />
    </div>
  );
}
