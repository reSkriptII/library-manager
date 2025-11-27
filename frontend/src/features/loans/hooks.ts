import { useEffect, useRef, useState } from "react";
import type { LoanData } from "./types";
import { api } from "@/lib/api.ts";

export function useUserLoan(borrowerId?: number | null) {
  const [loans, setLoans] = useState<LoanData[]>([]);
  const refreshRef = useRef(0);

  useEffect(() => {
    let isMount = true;

    (async () => {
      try {
        if (!borrowerId) return setLoans([]);
        const res = await api.get("/loans", {
          params: { active: true, borrowerId },
        });
        if (isMount) setLoans(res.data);
      } catch {
        if (isMount) setLoans([]);
      }
    })();

    return () => {
      isMount = false;
    };
  }, [borrowerId, refreshRef.current]);

  return { loans, refreshLoans: () => ++refreshRef.current };
}
