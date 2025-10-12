import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";

import "./index.css";
import { HomePage } from "./route/HomePage/HomePage.jsx";
import { LoginPage } from "./route/LoginPage/LoginPage.jsx";
import { BookPage } from "./route/BookPage/BookPage.js";
import { Dashboard } from "./route/Dashboard/DashBoard.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
