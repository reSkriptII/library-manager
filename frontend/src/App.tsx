import { Routes, Route } from "react-router";
import { UseProvider } from "./hook/UseProvider.js";

import { HomePage } from "./route/HomePage/HomePage.jsx";
import { LoginPage } from "./route/LoginPage/LoginPage.jsx";
import { BookPage } from "./route/BookPage/BookPage.js";
import { Dashboard } from "./route/Dashboard/DashBoard.js";
import { BorrowedBook } from "./route/Dashboard/subroute/BorrowedBook.js";
import { BorrowReturnBook } from "./route/Dashboard/subroute/BorrowReturnBook/BorrowReturnBook.js";
import { RegisterUser } from "./route/Dashboard/subroute/RegisterUser.js";

export default function App() {
  return (
    <UseProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="borrowed-books" element={<BorrowedBook />} />
          <Route path="borrow-return" element={<BorrowReturnBook />} />
          <Route path="register" element={<RegisterUser />} />
        </Route>
      </Routes>
    </UseProvider>
  );
}
