import { Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/home/Homepage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
