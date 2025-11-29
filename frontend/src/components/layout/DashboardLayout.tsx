import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "sonner";
import { useUser } from "#root/features/users/hooks.ts";
import { Header } from "./Header";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  const { user } = useUser();
  const userRef = useRef(user);
  const navigate = useNavigate();
  useEffect(() => {
    userRef.current = user;
    setTimeout(() => {
      if (!userRef.current || userRef.current.role === "member") navigate("/");
    }, 500);
  }, [user]);

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar />

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
