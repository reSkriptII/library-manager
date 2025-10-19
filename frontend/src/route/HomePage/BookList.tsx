import { Link } from "react-router";
import { Dot } from "#component/etc/Dot.tsx";
import type { booksData } from "./type";

export function BookList({ books }: { books: booksData }) {
  console.log(books);
  return (
    <div className="grid grid-cols-4">
      {books.map((book) => {
        return (
          <div className="relative p-2 text-center" key={book.id}>
            <img
              alt="book cover"
              src={window.api + `/book/${book.id}/cover`}
              className="m-auto h-72 w-auto"
            />
            <Dot
              className="absolute top-4 right-4 size-4"
              fill={book.available ? "lime" : "red"}
            />
            <p className="text-2xl">{book.title}</p>
            <p>{book.authors.join(", ")}</p>

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
