import axios from "axios";
import { useState, useEffect } from "react";
import { SearchField } from "#root/component/SearchField.jsx";
import { useDebounce } from "#root/hook/useDebounce.js";
import type { booksSearchOption } from "./type";
import type { booksData } from "#root/route/HomePage/type.js";

export function ManageBook() {
  const defaultSearchOption: booksSearchOption = {
    data: "",
    searchField: "title",
    availableOnly: false,
  };
  const [searchOption, setSearchOption] = useState(defaultSearchOption);
  const [books, setBooks] = useState<booksData | null>(null);

  function handleSearchOptionChange(
    option: "data" | "searchField" | "availableOnly",
    value: string | boolean,
  ): void {
    setSearchOption({
      ...searchOption,
      [option]: value,
    });
  }

  async function deleteBook(id: number) {
    try {
      await axios.delete(window.api + `/book/${id}/delete`, {
        withCredentials: true,
      });
      //TODO: reload book data
    } catch (err) {
      alert("can't delete book");
      console.log(err);
    }
  }

  const { data, searchField, availableOnly } = searchOption;

  //TODO: move search book as util function
  useEffect(
    useDebounce(async () => {
      const params = {
        search: data,
        field: searchField,
        availableOnly: availableOnly || null,
      };

      const booksResult = await axios.get(window.api + "/books", {
        params,
      });

      setBooks(booksResult.data);
    }, 200),
  );

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
          {book.authors.length <= 1 ? (
            book.authors[0]
          ) : (
            <ul>
              {book.authors.map((author) => {
                return <li key={author}>{author}</li>;
              })}
            </ul>
          )}
        </td>
        <td>
          {book.genres.length <= 1 ? (
            book.genres[0]
          ) : (
            <ul>
              {book.genres.map((genre) => {
                return <li key={genre}>{genre}</li>;
              })}
            </ul>
          )}
        </td>
        <td>series</td>
        <td>{String(book.available)}</td>
        <td>
          <button
            className="border border-black"
            onClick={() => deleteBook(book.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      <h1>Books</h1>
      <SearchField
        searchOption={searchOption}
        onChange={handleSearchOptionChange}
      />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>books title</th>
            <th>author</th>
            <th>genres</th>
            <th>series</th>
            <th>available</th>
          </tr>
        </thead>
        <tbody>{bookRows}</tbody>
      </table>
    </div>
  );
}
