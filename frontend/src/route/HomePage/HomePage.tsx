import { useState } from "react";
import { HeaderBar } from "../../component/HeaderBar/HeaderBar.jsx";
import { SearchField } from "./SearchField.jsx";
import type { booksSearchOption, booksSearchField } from "./type.ts";

export function HomePage() {
  const [searchOption, setSearchOption] = useState<booksSearchOption>({
    data: "",
    searchField: "title",
    availableOnly: false,
  });

  function handleSearchOptionChange(
    option: "data" | "searchField" | "availableOnly",
    value: string,
  ): void {
    setSearchOption({
      ...searchOption,
      [option]: value,
    });
  }

  return (
    <>
      <HeaderBar />
      <div>
        <h2>Book</h2>
        <SearchField
          searchOption={searchOption}
          onChange={handleSearchOptionChange}
        />
        <ul>Book list</ul>
      </div>
    </>
  );
}
