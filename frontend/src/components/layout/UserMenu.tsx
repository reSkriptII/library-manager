import { useContext } from "react";
import { ThemeProviderContext } from "@/contexts/ThemeContext";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { API_BASE_URL } from "@/env";
import { changeAvatar, logout } from "@/features/users/api.ts";
import { useUser } from "@/features/users/hooks.ts";
import { Label } from "../ui/label";
import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";

export function UserMenu() {
  const { theme } = useContext(ThemeProviderContext);
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState(0);
  const { setUser } = useUser();

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      toast.success("logged out successfully");
    } catch (err) {
      toast.error("logout error");
      console.log(err);
    }
  }

  async function handleAvatarChange(file: File | null) {
    try {
      await changeAvatar(file);
      setLastAvatarUpdate(Date.now());
      toast.success(`${file ? "change" : "remove"} avatar successfully`);
    } catch (err) {
      console.log(err);
      toast.error("error change avatar");
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-accent size-10 overflow-hidden rounded-full">
        <Avatar>
          <AvatarImage
            src={API_BASE_URL + "/users/me/avatar?t=" + lastAvatarUpdate}
            alt="avatar"
            className="size-10 object-cover"
          />
          <AvatarFallback>
            <img
              src={
                theme === "dark" ? "/avatar-icon-dark.svg" : "/avatar-icon.svg"
              }
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem asChild>
          <Label className="text-sm font-normal" htmlFor="avatar-file">
            <UserRound />
            Change avatar image
          </Label>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="ml-6"
          onClick={() => handleAvatarChange(null)}
        >
          Remove avatar image
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Input
        type="file"
        hidden
        id="avatar-file"
        onChange={(e) => {
          if (e.target.files) handleAvatarChange(e.target.files[0]);
        }}
      />
    </DropdownMenu>
  );
}
