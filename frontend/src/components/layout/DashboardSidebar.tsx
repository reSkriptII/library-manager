import { Book, CalendarClock, UserRoundPen, UserRoundPlus } from "lucide-react";
import { NavLink } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/features/users/hooks.ts";

export function DashboardSidebar() {
  const { user } = useUser();

  return (
    <Sidebar className="top-14 h-[calc(100vh-56px)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink to="loans">
                <CalendarClock /> Borrow & Return
              </SidebarLink>
              <SidebarLink to="register">
                <UserRoundPlus /> Register User
              </SidebarLink>
              {user?.role === "admin" && (
                <>
                  <SidebarLink to="books">
                    <Book /> Manage Books
                  </SidebarLink>
                  <SidebarLink to="users">
                    <UserRoundPen /> Manage Users
                  </SidebarLink>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

type SidebarLinkProps = {
  to: string;
  children: React.ReactNode;
};

function SidebarLink({ to, children }: SidebarLinkProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <NavLink
          to={to}
          className={({ isActive }) => (isActive ? "underline" : "")}
        >
          <span className="flex items-center gap-2">{children}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
