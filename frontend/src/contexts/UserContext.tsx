import { createContext, useState, useEffect } from "react";

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

export function UseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {}, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
