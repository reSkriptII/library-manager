import { createContext, useState, useEffect } from "react";
import { getUser } from "./api";
import type { User } from "./types";

export type userProviderState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<userProviderState | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMount = true;
    (async () => {
      const user = await getUser();
      if (isMount) setUser(user);
    })();
    return () => {
      isMount = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
