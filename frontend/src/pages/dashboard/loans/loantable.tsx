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

export type Loan = {
  borrowerId: number;
  bookId: number;
  bookTitle: string;
  borrowTime?: Date;
  dueDate?: Date;
};

type LoanTableProps = {
  loans: Loan[];
  mode?: "borrow" | "return";
  onSelect: (loan: Loan) => void;
};

export function LoanTable({
  loans,
  mode = "borrow",
  onSelect,
}: LoanTableProps) {
  return (
    <Table>
      <TableCaption>
        {mode === "borrow" ? "available books" : "borrowed books"}
      </TableCaption>
      <TableHeader>
        <TableRow className="flex gap-2">
          <TableHead className="w-20">Cover</TableHead>
          <TableHead className="w-6">ID</TableHead>
          <TableHead className="w-52">title</TableHead>
          <TableHead className="w-36">borrow date</TableHead>
          <TableHead className="w-20">due date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow
            key={loan.bookId}
            className="flex items-center gap-2"
            onClick={() => onSelect(loan)}
          >
            <TableCell className="flex h-24 w-20 items-center justify-center overflow-hidden">
              <img
                src={API_BASE_URL + `/books/${loan.bookId}/cover`}
                className="object-contain"
              />
            </TableCell>
            <TableCell className="w-6">{loan.bookId}</TableCell>
            <TableCell className="w-52">{loan.bookTitle}</TableCell>
            <TableCell className="w-32">
              {loan.borrowTime?.toDateString() ?? "-"}
            </TableCell>
            <TableCell className="w-32">
              {loan.dueDate?.toDateString() ?? "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
