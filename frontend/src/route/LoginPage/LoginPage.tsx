import axios from "axios";
import { useState } from "react";

export function LoginPage() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  async function handleLogin(e: any) {
    e.preventDefault();

    const result = await axios.post(
      window.api + "/auth/login",
      {
        email: emailInput,
        password: passwordInput,
      },
      {
        withCredentials: true,
      },
    );

    //TODO: login result notification

    if ((result.data.status = "success")) {
      alert("log in");
      window.location.href = "/";
    } else {
      //window.location.href = "./";
    }
  }
  return (
    <div className="mx-auto my-12 w-168 rounded-2xl bg-neutral-100 p-16">
      <h2 className="bold mb-8 text-center text-4xl font-bold">Login</h2>

      <form>
        <label className="my-4 block">
          <span className="text-2xl text-red-500">*</span>Email:
          <input
            type="email"
            name="email"
            className="peer block w-full rounded-lg border border-neutral-600 bg-white p-1 user-invalid:border-red-500"
            onChange={(e) => setEmailInput(e.target.value)}
            value={emailInput}
            required
          />
          <p className="hidden peer-user-invalid:block">Invalid Email</p>
        </label>

        <label className="mb-8 block">
          <span className="text-2xl text-red-500">*</span>Password:
          <input
            type="password"
            name="password"
            className="peer block w-full rounded-lg border border-neutral-600 bg-white p-1"
            onChange={(e) => setPasswordInput(e.target.value)}
            value={passwordInput}
            minLength={6}
          />
          <p className="hidden peer-user-invalid:block">
            Password must be 6 characters length or more
          </p>
        </label>

        <button
          type="submit"
          onClick={handleLogin}
          className="mx-auto block rounded-xl bg-neutral-300 px-6 py-2 text-2xl"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
