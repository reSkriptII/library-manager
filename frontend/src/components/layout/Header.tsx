import { useContext } from "react";
import { NavLink } from "react-router";
import { ThemeProviderContext } from "@/contexts/ThemeContext";
import { Logo } from "../logo";
import { LoginButton } from "./LoginButton";
import { UserMenu } from "./UserMenu";
import { useUser } from "@/features/users/hooks.ts";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { theme, setTheme } = useContext(ThemeProviderContext);
  const { user } = useUser();

  return (
    <header className="bg-background fixed top-0 left-0 z-50 w-full border-b">
      <div className="container m-auto flex h-14 items-center px-4 md:px-12">
        <NavLink to="/">
          <Logo />
        </NavLink>

        <div className="flex flex-1 items-center justify-end gap-8">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Moon /> : <Sun />}
          </button>
          {user ? (
            <>
              <NavLink to="/myloans">My loan</NavLink>
              {user.role !== "member" && (
                <NavLink to="/dashboard/loans">Dashboard</NavLink>
              )}
              <UserMenu />
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
