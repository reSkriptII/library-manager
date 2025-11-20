import { API_BASE_URL } from "#root/components/layout/env.ts";
import axios from "axios";
import { toast } from "sonner";

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
    if (err.request && !err.response) {
      if (!navigator.onLine) {
        toast.error("You're offline. Please connect to internet");
      } else if (err.code == "ECONNABORTED") {
        toast.error("Request time out");
      } else {
        toast.error("Connection failed");
      }
      return Promise.reject(err);
    }

    const status = err.response?.status;

    if (status >= 500) {
      window.location.href = "/servererror";
    }

    return Promise.reject(err);
  },
);
