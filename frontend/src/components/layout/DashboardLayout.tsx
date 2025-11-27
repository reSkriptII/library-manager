import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "sonner";
import { useUser } from "#root/features/users/hooks.ts";
import { Header } from "./Header";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout() {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || user.role === "member") navigate("/");
  }, [user]);

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />

        <main className="flex flex-grow flex-col">
          <SidebarTrigger className="fixed rounded-l-none border border-l-0" />
          <div className="container mx-auto flex flex-grow flex-col px-4 md:px-8">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
