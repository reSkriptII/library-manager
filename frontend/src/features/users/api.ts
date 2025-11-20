import { AxiosError } from "axios";
import { api } from "@/lib/api.ts";

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
  alert("logout");
}
export async function getUser() {
  try {
    const user = await api
      .get("/users/me", { withCredentials: true })
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
