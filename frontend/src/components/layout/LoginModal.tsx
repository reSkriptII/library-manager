import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { login } from "@/features/users/api.ts";
import { useState } from "react";
import { useUser } from "#root/features/users/hooks.ts";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  setOpen: (open: boolean) => void;
};

export function LoginModal({ open, onClose, setOpen }: LoginModalProps) {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setIsSubmitting(true);
    const user = await login({ email, password });
    setIsSubmitting(false);
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
        <DialogTitle className="text-4xl">Log in</DialogTitle>
        <div className="mb-4 flex flex-col gap-2">
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleLogin}
            disabled={isSubmitting}
          >
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
