import axios, { AxiosError } from "axios";
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export const UserContext = createContext<userContextType | null>(null);

export function UseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<user | null>(null);

  useEffect(() => {
    let isMount = true;
    async function getUser() {
      try {
        const result = await axios.get(window.api + "/user/me", {
          withCredentials: true,
        });

        if (isMount) setUser(result.data.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if ((err.status = 401)) {
            if (isMount) setUser(null);
          }
        }
      }
    }
    getUser();

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
