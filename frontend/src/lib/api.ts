import { API_BASE_URL } from "@/env.ts";
import axios from "axios";
import { toast } from "sonner";

let isErrorPage = false;
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 6000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isCancel(err)) {
      return Promise.reject(err);
    }
    if (window.location.pathname.startsWith("/servererror")) {
      isErrorPage = true;
      return;
    }

    if (err.request && !err.response) {
      if (!navigator.onLine) {
        toast.error("You're offline. Please connect to internet");
      } else if (err.code == "ECONNABORTED") {
        toast.error("Request time out");
      } else {
        if (isErrorPage) return;
        isErrorPage = true;
        window.location.pathname = "/servererror";
      }
      return Promise.reject(err);
    }

    const status = err.response?.status;

    if (status >= 500) {
      if (isErrorPage) return;
      isErrorPage = true;
      window.location.pathname = "/servererror";
    }

    return Promise.reject(err);
  },
);
