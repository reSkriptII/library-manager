import { Routes, Route } from "react-router";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./route/HomePage/HomePage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<div>test</div>} />
      </Route>
    </Routes>
  );
}
