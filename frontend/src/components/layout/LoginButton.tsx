import { useState } from "react";
import { Button } from "../ui/button";
import { LoginModal } from "./LoginModal";

export function LoginButton({ isHero = false }: { isHero?: boolean }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsLoginOpen(true)}
        className={isHero ? "bg-black text-white hover:bg-neutral-800" : ""}
      >
        Log in
      </Button>
      <LoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        setOpen={setIsLoginOpen}
      />
    </>
  );
}
