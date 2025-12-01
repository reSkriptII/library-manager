import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { Header } from "./Header";
export function Layout() {
  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <main className="mt-14 flex flex-grow flex-col">
        <div className="container mx-auto flex flex-grow flex-col px-4 md:px-8">
          <Outlet />
        </div>
      </main>
    </>
  );
}
