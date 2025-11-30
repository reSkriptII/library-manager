import { useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api } from "@/lib/api.ts";
import { UserContext } from "./contexts.tsx";
import type { User } from "./types";
import { getUser } from "./api";

export const useUser = () => {
  const context = useContext(UserContext);

  if (context == null) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export function useGetUser(id?: number) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMount = true;
    (async () => {
      if (!id) {
        setUser(null);
        return;
      }

      try {
        const res = await getUser(id);
        if (isMount) setUser(res);
      } catch {
        if (isMount) setUser(null);
      }
    })();

    return () => {
      isMount = false;
    };
  }, [id]);

  return user;
}

export function useUserList() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    let isMount = true;

    (async () => {
      try {
        const res = await api.get("/users");
        if (isMount) setUsers(res.data);
      } catch (error) {
        if (isMount) setUsers([]);
      }
    })();
    return () => {
      isMount = false;
    };
  }, []);

  return users;
}
