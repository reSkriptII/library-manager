import { Outlet } from "react-router";
import { Header } from "./Header";
export function Layout() {
  return (
    <>
      <Header />
      <div className="flex flex-grow flex-col">
        <div className="container mx-auto my-2 flex flex-grow flex-col px-4 md:px-8">
          <Outlet />
        </div>
      </div>
    </>
  );
}
