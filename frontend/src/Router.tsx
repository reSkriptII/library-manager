import { Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/home/HomePage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoansPages } from "./pages/dashboard/loans/LoansPage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="/dashboard/loans" element={<LoansPages />} />
      </Route>
    </Routes>
  );
}
