import { Routes, Route } from "react-router";
import { HomePage } from "./route/HomePage/HomePage.jsx";
import { LoginPage } from "./route/LoginPage/LoginPage.jsx";
import { BookPage } from "./route/BookPage/BookPage.js";
import { Dashboard } from "./route/Dashboard/DashBoard.js";
import { UseProvider } from "./hook/UseProvider.js";

export default function App() {
  return (
    <UseProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="borrowed-book" element={<LoginPage />} />
        </Route>
      </Routes>
    </UseProvider>
  );
}
