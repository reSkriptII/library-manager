import type { LoanData } from "@/features/loans/types.ts";
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

type LoanTableProps = {
  loans: LoanData[];
  mode?: "borrow" | "return";
  onSelect: (loan: LoanData) => void;
};

export function LoanTable({
  loans,
  mode = "borrow",
  onSelect,
}: LoanTableProps) {
  return (
    <Table className="mt-4">
      <TableCaption>borrowed books</TableCaption>
      <TableHeader>
        <TableRow className="flex">
          <TableHead className="w-20">Cover</TableHead>
          <TableHead className="w-6">ID</TableHead>
          <TableHead className="w-14">BookID</TableHead>
          <TableHead className="w-52">Title</TableHead>
          <TableHead className="w-36">Borrow date</TableHead>
          <TableHead className="w-20">due date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow
            key={loan.bookId}
            className="flex items-center"
            onClick={() => onSelect(loan)}
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
            <TableCell className="w-6">{loan.borrowerId}</TableCell>
            <TableCell className="w-14">{loan.bookId}</TableCell>
            <TableCell className="w-52">{loan.bookTitle}</TableCell>
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
      {!loans[0] && <p className="mt-4 text-center">No loan found</p>}
    </Table>
  );
}
