import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { API_BASE_URL } from "./env";
import { logout } from "@/features/users/api.ts";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-10 rounded-full bg-black">
        <Avatar>
          <AvatarImage src={API_BASE_URL + "/users/me/avatar"} alt="avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-24">
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
