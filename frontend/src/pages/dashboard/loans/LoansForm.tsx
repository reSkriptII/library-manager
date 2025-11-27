import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";

export type LoanFilter = {
  borrowerId: number;
  bookId: number;
  bookTitle: string;
  mode: "borrow" | "return";
};

type LoansFormProps = {
  filter: LoanFilter;
  onChange: (filter: LoanFilter) => void;
};

export function LoansForm({ filter, onChange }: LoansFormProps) {
  return (
    <div className="block items-center gap-8 lg:flex">
      <div className="flex flex-col gap-2 lg:w-2/3">
        <div>
          <Label htmlFor="borrower">borrower ID</Label>
          <Input
            id="borrower"
            type="number"
            value={filter.borrowerId}
            onChange={(e) =>
              onChange({ ...filter, borrowerId: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex gap-2">
          <div className="w-32">
            <Label htmlFor="book-id">book ID</Label>
            <Input
              id="book-id"
              type="number"
              value={filter.bookId}
              onChange={(e) =>
                onChange({ ...filter, bookId: Number(e.target.value) })
              }
            />
          </div>
          <div className="grow">
            <Label htmlFor="book-title">book title</Label>
            <Input
              id="book-title"
              value={filter.bookTitle}
              onChange={(e) =>
                onChange({ ...filter, bookTitle: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex h-fit w-fit items-center justify-center gap-8 rounded-sm border p-2 lg:h-full lg:w-56 lg:flex-col lg:gap-2">
        <div>
          <Label htmlFor="airplane-mode">Borrow/Return mode</Label>
          <div className="mt-1 flex items-center space-x-2 text-sm">
            <span>Borrow</span>
            <Switch
              defaultChecked
              id="airplane-mode"
              onCheckedChange={(isCheck) =>
                onChange({ ...filter, mode: isCheck ? "return" : "borrow" })
              }
            />
            <span>Return</span>
          </div>
        </div>
        <p className="text-center text-xl font-bold">
          <span className="text-sm font-medium">current mode: </span>
          {filter.mode}
        </p>
      </div>
    </div>
  );
}
