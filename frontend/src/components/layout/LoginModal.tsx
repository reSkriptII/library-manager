import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { login } from "@/features/users/api.ts";
import { useUser } from "@/features/users/hooks.ts";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  setOpen: (open: boolean) => void;
};

export function LoginModal({ open, onClose, setOpen }: LoginModalProps) {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    if (!email || !password)
      return toast.error("email or password can't be empty");
    setLoading(true);
    const user = await login({ email, password });
    setLoading(false);
    if (!user) {
      toast.error("Incorrect email or password");
      return;
    }

    toast.success("Logged in successfully");
    setOpen(false);
    setUser(user);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogOverlay />
      <DialogContent className="sm:w-98">
        <DialogDescription className="sr-only">
          Enter your email address and password to securely sign in to your
          account.
        </DialogDescription>
        <form>
          <DialogTitle className="mb-6 text-4xl">Log in</DialogTitle>
          <div className="mb-8 flex flex-col gap-4">
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
                minLength={6}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handleLogin}
              disabled={loading}
            >
              Log in
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
