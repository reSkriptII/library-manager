import { LoginButton } from "@/components/layout/LoginButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useUser } from "@/features/users/hooks.ts";
import { NavLink } from "react-router";

export function Hero() {
  const { user } = useUser();

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 border-b bg-[url('herobackground.webp')] bg-cover">
      <div className="container mx-auto px-8 py-12">
        <h1 className="mb-8 text-2xl text-black">
          Welcome to <span className="text-3xl font-bold">The Library</span>
        </h1>
        {user ? (
          user.role === "member" ? (
            <Button className="bg-black text-white hover:bg-neutral-800">
              <NavLink to="/loan">Your borrowed books</NavLink>
            </Button>
          ) : (
            <Button className="bg-black text-white hover:bg-neutral-800">
              <NavLink to="/dashboard">Dashboard</NavLink>
            </Button>
          )
        ) : (
          <LoginButton isHero />
        )}
      </div>
    </div>
  );
}
