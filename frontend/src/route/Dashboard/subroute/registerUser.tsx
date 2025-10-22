import { FormInput } from "#root/component/FormInput.tsx";
import axios from "axios";
import { useState } from "react";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function RegisterUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  async function handleRegister() {
    if (!username || password.length < 6 || !EMAIL_REGEXP.test(email)) return;
    try {
      await axios.post(window.api + "/register", {
        name: username,
        email,
        password,
      });
      setInvalid(false);
      //TODO: notify success
      alert("successfully register user");
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setInvalid(true);
        return;
      }
    }
  }

  return (
    <div className="mt-16 px-32">
      <h2 className="mt-16 mb-8 text-center text-4xl font-bold">
        Register User
      </h2>
      {invalid && (
        <p className="mx-auto w-fit border border-red-500 bg-red-300 px-4 py-2">
          Register Failed.
        </p>
      )}
      <form>
        <FormInput
          label="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FormInput
          label="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          invalidMsg="Invalid email"
          required
        />
        <FormInput
          label="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </form>
      <button
        className="mx-auto mt-8 block w-72 border border-black py-2.5 text-xl shadow shadow-neutral-500 active:shadow-none"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}
