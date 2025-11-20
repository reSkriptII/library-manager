import { useState } from "react";
import { Button } from "../ui/button";
import { LoginModal } from "./LoginModal";

export function LoginButton() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsLoginOpen(true)}>Log in</Button>
      <LoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        setOpen={setIsLoginOpen}
      />
    </>
  );
}
