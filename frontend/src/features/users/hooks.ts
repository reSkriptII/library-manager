import { useContext } from "react";
import { UserContext } from "#root/features/users/contexts.tsx";

export const useUser = () => {
  const context = useContext(UserContext);

  if (context == null) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
