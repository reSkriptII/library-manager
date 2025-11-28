import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoanTable } from "@/features/loans/components/loantable.tsx";
import { useMyLoans } from "@/features/loans/hooks.ts";
import { useUser } from "@/features/users/hooks.ts";

export function MyLoansPage() {
  const loans = useMyLoans();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    setTimeout(() => {
      if (!user || user.role === "member") navigate("/");
    }, 500);
  }, [user]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Borrow & Return books</h1>
      <LoanTable loans={loans} />
    </>
  );
}
