import axios from "axios";
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { userContextType, user } from "type";

export const UserContext = createContext<userContextType | null>(null);

export function UseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    let isMount = true;

    axios
      .get(window.api + "/auth/me", { withCredentials: true })
      .then((res) => {
        if (isMount) setUser(res.data.data);
      });

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
