import { createContext, useState, useEffect } from "react";
import { getUser } from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "member" | "librarian" | "admin";
};

export type userProviderState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const UserContext = createContext<userProviderState | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user) setUser(user);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
