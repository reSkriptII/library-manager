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
      <h1 className="mt-8 mb-4 text-2xl font-bold">My Loans</h1>
      <LoanTable loans={loans} />
    </>
  );
}
