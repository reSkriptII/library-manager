import axios from "axios";
import { useState, useEffect } from "react";
import type { bookData } from "./type";

export function BorrowedBook() {
  const [books, setBooks] = useState<bookData[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(window.api + "/user/borrowedbook", {
          withCredentials: true,
        });
        setBooks(result.data.data);
        console.log(result.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const bookRows =
    books &&
    books.map((book) => (
      <tr key={book.id}>
        <td className="flex size-24 items-center justify-center">
          <img
            src={window.api + `/book/${book.id}/cover`}
            className="max-h-full max-w-full"
          />
        </td>
        <td>{book.id}</td>
        <td>{book.title}</td>
        <td>
          <p>
            {new Date(book.borrow_time).toLocaleDateString("iso")}
            <br />
            {new Date(book.borrow_time).toLocaleTimeString()}
          </p>
        </td>
        <td>{new Date(book.due_date).toLocaleDateString()}</td>
      </tr>
    ));

  return (
    <div>
      <h1>borrowed book</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>books title</th>
            <th>borrow</th>
            <th>return date</th>
          </tr>
        </thead>
        <tbody>{bookRows}</tbody>
      </table>
    </div>
  );
}
