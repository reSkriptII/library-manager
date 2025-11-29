import { Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/home/HomePage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoansPage } from "./pages/dashboard/loans/LoansPage";
import { MyLoansPage } from "./pages/myloans/MyLoansPage";
import { RegisterPage } from "./pages/dashboard/RegisterPage";
import { BooksPage } from "./pages/dashboard/books/BooksPage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/myloans" element={<MyLoansPage />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="/dashboard/loans" element={<LoansPage />} />
        <Route path="/dashboard/register" element={<RegisterPage />} />
        <Route path="/dashboard/books" element={<BooksPage />} />
      </Route>
    </Routes>
  );
}
