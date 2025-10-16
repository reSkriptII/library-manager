import { Outlet } from "react-router";
import { HeaderBar } from "../../component/HeaderBar/HeaderBar";
import { DashBoardNav } from "./DashBoardNav";

export function Dashboard() {
  return (
    <>
      <HeaderBar />
      <DashBoardNav />
      <div className="ml-50">
        <Outlet />
      </div>
    </>
  );
}
