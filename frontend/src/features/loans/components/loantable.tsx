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
import type { LoanData } from "@/features/loans/types.ts";

type LoanTableProps = {
  loans: LoanData[];
  onSelect?: (loan: LoanData) => void;
};

export function LoanTable({ loans, onSelect }: LoanTableProps) {
  return (
    <>
      <Table className="mt-4">
        <TableCaption>borrowed books</TableCaption>
        <TableHeader>
          <TableRow className="flex">
            <TableHead className="w-20 text-center">Cover</TableHead>
            <TableHead className="w-6 text-center">ID</TableHead>
            <TableHead className="w-14 text-center">BookID</TableHead>
            <TableHead className="w-52 text-center lg:w-72">Title</TableHead>
            <TableHead className="w-32 text-center">Borrow date</TableHead>
            <TableHead className="w-32 text-center">due date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow
              key={loan.bookId}
              className="flex items-center"
              onClick={() => onSelect?.(loan)}
            >
              <TableCell className="flex h-24 w-20 items-center justify-center overflow-hidden">
                <img
                  src={API_BASE_URL + `/books/${loan.bookId}/cover`}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/book.svg";
                  }}
                />
              </TableCell>
              <TableCell className="w-6 text-center">{loan.id}</TableCell>
              <TableCell className="w-14 text-center">{loan.bookId}</TableCell>
              <TableCell className="w-52 lg:w-72">{loan.bookTitle}</TableCell>
              <TableCell className="w-32">
                {loan?.borrowTime
                  ? new Date(loan.borrowTime).toDateString()
                  : "-"}
              </TableCell>
              <TableCell className="w-32">
                {loan?.dueDate ? new Date(loan.dueDate).toDateString() : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!loans[0] && <p className="border-b p-2 text-center">no loan found</p>}
    </>
  );
}
