import { Button } from "#root/components/ui/button.tsx";
import { returnLoans, submitLoans } from "#root/features/loans/api.ts";
import { toast } from "sonner";

type SubmitButtonProps = {
  mode: "borrow" | "return";
  returnLoanId?: number;
  borrowData?: { borrowerId: number; bookId: number };
  onAfterSubmit?: () => void;
};

export function SubmitButton({
  mode,
  returnLoanId,
  borrowData,
  onAfterSubmit,
}: SubmitButtonProps) {
  async function handleSubmit() {
    if (mode === "borrow") {
      if (!borrowData) {
        return toast.error("Invalid loan data");
      }
      const res = await submitLoans(borrowData);
      if (res?.ok) {
        return toast.success("Successfully borrow a book");
      } else {
        return toast.error(res?.message ?? "unknow error");
      }
    } else {
      if (!returnLoanId) {
        return toast.error("Invalid loan");
      }
      const res = await returnLoans(returnLoanId);
      console.log(res);
      if (res?.ok) {
        return toast.success("successfully return a book");
      } else {
        return toast.error(res?.message ?? "unknow error");
      }
    }
  }
  onAfterSubmit?.();
  return (
    <Button className="text-xl sm:col-span-2" onClick={handleSubmit}>
      {mode}
    </Button>
  );
}
