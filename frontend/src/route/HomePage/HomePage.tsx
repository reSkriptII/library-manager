import { useEffect, useState } from "react";
import { useDebounce } from "#hook/useDebounce.ts";

// import { HeaderBar } from "@component/HeaderBar/HeaderBar.jsx";
import { SearchField } from "./SearchField.jsx";
import type { booksData, booksSearchOption } from "./type.ts";
import { BookList } from "./BookList.tsx";
import axios from "axios";

export function HomePage() {
  const defaultSearchOption: booksSearchOption = {
    data: "",
    searchField: "title",
    availableOnly: false,
  };

  const [searchOption, setSearchOption] =
    useState<booksSearchOption>(defaultSearchOption);
  const [books, setBooks] = useState<booksData>([]);

  function handleSearchOptionChange(
    option: "data" | "searchField" | "availableOnly",
    value: string,
  ): void {
    setSearchOption({
      ...searchOption,
      [option]: value,
    });
  }

  const { data, searchField, availableOnly } = searchOption;
  useEffect(
    useDebounce(async () => {
      const booksResult = await axios.get(window.api + "/book", {
        params: { search: data, field: searchField, available: availableOnly },
      });
      setBooks(booksResult.data);
    }, 500),
    [data, searchField, availableOnly],
  );

  return (
    <>
      {/* <HeaderBar /> */}
      <div>
        <h2>Book</h2>
        <SearchField
          searchOption={searchOption}
          onChange={handleSearchOptionChange}
        />
        <BookList books={books} />
      </div>
    </>
  );
}
