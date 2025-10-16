import type { Dispatch, SetStateAction } from "react";

export type user = {
  id: number;
  name: string;
  email: string;
  role: "user" | "librarian" | "admin";
};

type userContextType = {
  user: user | null;
  setUser: Dispatch<SetStateAction<user | null>>;
};
