import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { registerUser } from "#root/features/users/api.ts";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: any) {
    e.preventDefault();
    if (!name || !email || !password)
      return toast.error("Input fields can't be empty");

    setLoading(true);
    const res = await registerUser({ name, email, password });
    setLoading(false);
    if (!res?.ok) {
      return toast.error(res?.message ?? "unknow error");
    } else {
      toast.success("Register new user successfully");
    }
  }

  return (
    <>
      <h1 className="my-8 text-center text-2xl font-bold">Register User</h1>
      <form className="mx-auto w-full max-w-128 px-8">
        <div className="mb-8 flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          onClick={handleRegister}
          disabled={loading}
        >
          Register new User
        </Button>
      </form>
    </>
  );
}
