import { AxiosError } from "axios";
import { api } from "@/lib/api.ts";
import { toast } from "sonner";

export async function login(payload: { email: string; password: string }) {
  try {
    await api.post("/auth/login", payload, {
      withCredentials: true,
    });

    return await getUser();
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return null;
      }
    }
  }
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function getUser(id?: number) {
  try {
    const user = await api
      .get(id ? `/users/${id}` : "/users/me")
      .then((r) => r.data);
    return user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.status as number;
      if (status >= 400) {
        return null;
      }
    }
  }
}

export async function changeAvatar(file: File | null) {
  if (!file) {
    await api.put("/users/me/avatar");
    return;
  }

  const body = new FormData();
  body.append("avatar", file);

  await api.put("/users/me/avatar", body);
}
