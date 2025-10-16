import { Link } from "react-router";
import type { booksData } from "./type";

export function BookList({ books }: { books: booksData }) {
  return (
    <div className="flex flex-wrap justify-between">
      {books.map((book) => {
        return (
          <div className="relative p-2 text-center" key={book.id}>
            <img
              alt="book cover"
              src={window.api + `/book/${book.id}/cover`}
              className="h-72 w-auto"
            />
            <p className="text-2xl">{book.title}</p>
            <p>{book.author}</p>

            <Link
              className="absolute top-0 left-0 z-20 size-full rounded-lg hover:bg-black/10"
              to={"./book/" + book.id}
              target="_blank"
            ></Link>
          </div>
        );
      })}
    </div>
  );
}
