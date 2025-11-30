import { useEffect, useState } from "react";
import type { LoanData } from "./types";
import { api } from "@/lib/api.ts";

export function useLoans(borrowerId: number | null, refresh: any) {
  const [loans, setLoans] = useState<LoanData[]>([]);

  useEffect(() => {
    let isMount = true;

    (async () => {
      try {
        if (!borrowerId) {
          return setLoans([]);
        }

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
  }, [borrowerId, refresh]);

  return loans;
}

export function useMyLoans() {
  const [loans, setLoans] = useState<LoanData[]>([]);

  useEffect(() => {
    let isMount = true;
    (async () => {
      try {
        const res = await api.get("/users/me/loans");
        if (isMount) setLoans(res.data);
      } catch {
        if (isMount) setLoans([]);
      }
    })();

    return () => {
      isMount = false;
    };
  }, []);

  return loans;
}
