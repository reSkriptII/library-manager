import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { API_BASE_URL } from "@/env.ts";
import type { BookData } from "../type";

type BookTableProps = {
  books: BookData[];
  onSelect: (book: BookData) => void;
  caption: string;
};

export function BookTable({ books, onSelect, caption }: BookTableProps) {
  return (
    <>
      <Table className="mt-4">
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow className="flex">
            <TableHead className="min-w-20 text-center">Cover</TableHead>
            <TableHead className="min-w-8 text-center">ID</TableHead>
            <TableHead className="min-w-52 text-center">Title</TableHead>
            <TableHead className="min-w-24 text-center">Genres</TableHead>
            <TableHead className="min-w-32 text-center">Authors</TableHead>
            <TableHead className="min-w-32 text-center">Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book.id}
              className="flex items-center"
              onClick={() => onSelect(book)}
            >
              <TableCell className="flex h-24 w-20 items-center justify-center overflow-hidden">
                <img
                  src={API_BASE_URL + `/books/${book.id}/cover`}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/book.svg";
                  }}
                />
              </TableCell>
              <TableCell className="min-w-8 text-center">{book.id}</TableCell>
              <TableCell className="min-w-52">{book.title}</TableCell>
              <TableCell className="min-w-24">
                <ul>
                  {book.genres.map((genre) => (
                    <li className="list-none" key={genre.id}>
                      {genre.name}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="min-w-32">
                <ul>
                  {book.authors.map((author) => (
                    <li className="list-none" key={author.id}>
                      {author.name}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="min-w-32">
                {book.reserveQueue || book.lent ? "not available" : "available"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!books[0] && <p className="border-b p-2 text-center">no book found</p>}
    </>
  );
}
