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

type RegisterReqBody = { name: string; email: string; password: string };
export async function registerUser(registerReqBody: RegisterReqBody) {
  try {
    await api.post("/users", registerReqBody);
    return { ok: true };
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: err.response?.data.message,
        };
      }
    }
  }
}

export async function UpdateUser(
  id: number,
  field: "name" | "role",
  value: string,
) {
  try {
    await api.put(`/users/${id}/${field}`, { [field]: value });
    return { ok: true };
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: err.response?.data.message,
        };
      }
    }
  }
}

export async function deleteUser(id: number) {
  try {
    await api.delete(`/users${id}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.status as number;
      if (status >= 400) {
        return {
          ok: false,
          message: err.response?.data.message,
        };
      }
    }
  }
}
